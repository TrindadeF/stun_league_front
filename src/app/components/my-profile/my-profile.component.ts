import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { RequestsService } from '../../services/requests/requests.service';
import { PlayerResponseDTO } from '../../models/PlayerResponseDTO';
import { Chart, ChartModule } from 'angular-highcharts';
import { MatchPlayerResponseDTO } from '../../models/MatchPlayerResponseDTO';
import { MyProfileHeaderComponent } from "../my-profile-header/my-profile-header.component";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../../services/user-services/user.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [SidebarComponent, CommonModule, ChartModule, MyProfileHeaderComponent],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  imageSrc: string | ArrayBuffer | null = null;
  public haveYtInfo: boolean = true;
  public haveInstaInfo: boolean = true;
  public username: string = "";
  public name: string = "";
  public playerResponseDTO!: PlayerResponseDTO;
  public matchesPlayerResponseDTO!: MatchPlayerResponseDTO[];
  private playerId!: number;

  lineChart: Chart = new Chart({
    chart: {
      type: 'line'
    },
    title: {
      text: 'Vitórias e Derrotas por Data'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: [],
      title: {
        text: 'Data'
      }
    },
    yAxis: {
      title: {
        text: 'Número de Partidas'
      }
    },
    series: [
      {
        type: 'line',
        name: 'Vitórias',
        data: []
      },
      {
        type: 'line',
        name: 'Derrotas',
        data: []
      }
    ]
  });

  pieChart: Chart = new Chart({
    chart: {
      type: 'pie',
      plotShadow: false,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        innerSize: '99%',
        borderWidth: 10,
        borderColor: '',
        slicedOffset: 10,
        dataLabels: {
          connectorWidth: 0,
        },
      },
    },
    title: {
      verticalAlign: 'middle',
      floating: true,
      text: 'Distribuição de Vitórias e Derrotas',
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        type: 'pie',
        data: []
      }
    ]
  });

  constructor(
    private cookie: CookieService,
    private req: RequestsService,
    private userService: UserService
  ) { }

  async ngOnInit(): Promise<void> {
    this.username = this.cookie.get("username") ?? "";
    this.name = this.cookie.get("name") ?? "";
    this.playerId = Number(this.cookie.get("id"));

    try {
      this.imageSrc = await this.userService.getImageProfile();
    } catch (error) {
      console.error('Erro ao baixar imagem de perfil:', error);
    }

    this.getPlayerReponseDTO();
    this.getPlayerMatches();
  }

  getPlayerReponseDTO() {
    this.req.get<PlayerResponseDTO>(`/v1/players/username/${this.username}`)
      .subscribe((data: PlayerResponseDTO) => {
        this.playerResponseDTO = data;
      }, (error) => {
        console.log(error);
      });
  }

  getTotalPartidas() {
    return Number(this.playerResponseDTO.wins) + Number(this.playerResponseDTO.losses);
  }

  getPlayerMatches() {
    this.req.get<MatchPlayerResponseDTO[]>(`/v1/players/match-players/${this.playerId}`)
      .subscribe((data: MatchPlayerResponseDTO[]) => {
        this.matchesPlayerResponseDTO = data;
        this.updateLineChart();
        this.updatePieChart();
      }, (error) => {
        console.log(error);
      });
  }

  updateLineChart(filteredData: MatchPlayerResponseDTO[] = this.matchesPlayerResponseDTO) {
    console.log("DATAS: " + JSON.stringify(filteredData))
    const dates = filteredData.map(data => new Date(data.matchDate).toLocaleDateString());
    const wins = filteredData.map(data => data.wins);
    const losses = filteredData.map(data => data.losses);

    this.lineChart = new Chart({
      chart: {
        type: 'line',
        backgroundColor: '#141414' // Fundo preto
      },
      title: {
        text: 'Vitórias e Derrotas por Data',
        style: {
          color: '#C0C0C0' // Cor cinza para o título
        }
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: dates,
        title: {
          text: 'Data',
          style: {
            color: '#C0C0C0' // Cor cinza para o título do eixo X
          }
        },
        labels: {
          style: {
            color: '#C0C0C0' // Cor cinza para os rótulos do eixo X
          }
        },
        gridLineColor: '#555555' // Cor cinza para as linhas de grade do eixo X
      },
      yAxis: {
        title: {
          text: 'Número de Partidas',
          style: {
            color: '#C0C0C0' // Cor cinza para o título do eixo Y
          }
        },
        labels: {
          style: {
            color: '#C0C0C0' // Cor cinza para os rótulos do eixo Y
          }
        },
        gridLineColor: '#555555' // Cor cinza para as linhas de grade do eixo Y
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
            color: '#C0C0C0' // Cor cinza para os rótulos dos dados
          },
          enableMouseTracking: true
        }
      },
      series: [
        {
          type: 'line',
          name: 'Vitórias',
          data: wins,
          color: '#00FF00', // Cor verde para vitórias
          marker: {
            symbol: 'circle'
          }
        },
        {
          type: 'line',
          name: 'Derrotas',
          data: losses,
          color: '#FF0000', // Cor vermelha para derrotas
          marker: {
            symbol: 'square'
          }
        }
      ]
    });
  }

  updatePieChart() {
    const totalWins = this.matchesPlayerResponseDTO.reduce((sum, data) => sum + data.wins, 0);
    const totalLosses = this.matchesPlayerResponseDTO.reduce((sum, data) => sum + data.losses, 0);

    this.pieChart = new Chart({
      chart: {
        type: 'pie',
        plotShadow: false,
        backgroundColor: '#141414' // Fundo preto
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          innerSize: '100%',
          borderWidth: 10,
          borderColor: '',
          slicedOffset: 10,
          dataLabels: {
            connectorWidth: 0,
            style: {
              color: '#C0C0C0' // Cor cinza para os rótulos dos dados
            }
          },
          colors: ['#00FF00', '#FF0000'] // Cores verde e vermelha para as fatias
        },
      },
      title: {
        verticalAlign: 'middle',
        floating: true,
        text: 'Distribuição de Vitórias e Derrotas',
        style: {
          color: '#C0C0C0' // Cor cinza para o título
        }
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          type: 'pie',
          data: [
            { name: 'Vitórias', y: totalWins, color: '#00FF00' }, // Cor verde para vitórias
            { name: 'Derrotas', y: totalLosses, color: '#FF0000' } // Cor vermelha para derrotas
          ]
        }
      ]
    });
  }

  filterData() {
    const startDate = (document.getElementById('startDate') as HTMLInputElement).value;
    const endDate = (document.getElementById('endDate') as HTMLInputElement).value;

    if (startDate && endDate) {
      const filteredData = this.matchesPlayerResponseDTO.filter(data => {
        const matchDate = new Date(data.matchDate);
        return matchDate >= new Date(startDate) && matchDate <= new Date(endDate);
      });

      this.updateLineChart(filteredData);
      this.updatePieChart();
      }
    }

    resetFilter() {
    // Limpar os campos de data
    (document.getElementById('startDate') as HTMLInputElement).value = '';
    (document.getElementById('endDate') as HTMLInputElement).value = '';

    this.updateLineChart();
    this.updatePieChart();
  }

}
