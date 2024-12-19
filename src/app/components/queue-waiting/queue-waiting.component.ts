import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketQueueService } from '../../services/socket/web-socket-queue.service';
import { Router } from '@angular/router';
import { PlayerResponseDTO } from '../../models/PlayerResponseDTO';
import { FormsModule } from '@angular/forms';
import { RequestsService } from '../../services/requests/requests.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { QueueRequestDTO } from '../../models/QueueRequestDTO';
import { QueueVoteRequestDTO } from '../../models/QueueVoteRequestDTO';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-queue-waiting',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './queue-waiting.component.html',
  styleUrls: ['./queue-waiting.component.css']
})
export class QueueWaitingComponent implements OnInit, OnDestroy {
  players: number = 0;
  messageConfirmPlayers: number = 0;
  playerResponseDTO!: PlayerResponseDTO;
  showMapsContainer: boolean = false;
  isVisibleBtnQueueConfirm: boolean = false;
  alreadyConfirm: boolean = false;
  playerVotedMap: boolean = false;
  dots: number[] = Array(10).fill(0);
  mapWinner: string = '';
  timerRunning: boolean = false;
  queueSwitch: boolean = false;
  isMapWinner: boolean = false;
  playersNames: string[] = [];
  timer: number = 20;
  alreadyGetWinner: boolean =  false;

  private winnerCalled: boolean = false; // Variável de controle para garantir que o getWinner seja chamado uma vez

  constructor(
    private ws: WebSocketQueueService,
    private router: Router,
    private req: RequestsService,
    private cookie: CookieService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.playerResponseDTO = navigation.extras.state['player'];
    }
  }

  ngOnInit(): void {
    this.subscribeToWebSocket();
  }

  ngOnDestroy(): void {
    this.ws.unsubscribeTopic(`/topic/queue/${this.cookie.get('queue-id')}`);
  }

  private subscribeToWebSocket(): void {
    const queueId = this.cookie.get('queue-id');
    this.ws.subscribeTopic(null, `/topic/queue/${queueId}`);
    this.ws.sendMessage('get', queueId);

    this.ws.messageQueueConfirm.subscribe(confirmPlayers => {
      this.messageConfirmPlayers = confirmPlayers;
      this.isVisibleBtnQueueConfirm = this.players === Utils.MAX_PLAYERS_TO_START;
      this.showMapsContainer = confirmPlayers === Utils.MAX_PLAYERS_TO_START;

      if (this.showMapsContainer && !this.timerRunning && !this.isMapWinner && !this.winnerCalled) {
        this.startTimer();
      }
    });

    this.ws.messageReceived.subscribe(players => {
      this.players = players;
    });

    this.ws.playersNames.subscribe(playersNames => {
      this.playersNames = playersNames;
    });
  }

  confirmQueue(): void {
    if (this.alreadyConfirm) return;

    this.alreadyConfirm = true;
    const queueConfirmDTO = new QueueRequestDTO(
      this.cookie.get('queue-id'),
      Number(this.cookie.get('id'))
    );
    this.ws.sendMessage('confirm', queueConfirmDTO);
  }

  leaveQueue(): void {
    if (!this.playerResponseDTO) {
      this.req.get<PlayerResponseDTO>(`/v1/players/username/${this.cookie.get('username')}`)
        .subscribe({
          next: (data: PlayerResponseDTO) => {
            this.playerResponseDTO = data;
            this.sendLeaveMessage();
          },
          error: (error) => {
            console.error(error);
          }
        });
    } else {
      this.sendLeaveMessage();
    }
  }

  private sendLeaveMessage(): void {
    const queueLeaveDTO = new QueueRequestDTO(
      this.cookie.get('queue-id'),
      this.playerResponseDTO.id
    );
    this.ws.sendMessage('leave', queueLeaveDTO);
    this.router.navigateByUrl('/home');
    this.alreadyConfirm = false;
  }

  selectMap(event: Event): void {
    if (this.playerVotedMap) return;

    const selectedImage = event.target as HTMLElement;
    const images = document.querySelectorAll('.maps-gallery img');
    images.forEach(img => img.classList.remove('selected'));
    selectedImage.classList.add('selected');

    const mapName = selectedImage.getAttribute('alt') || '';
    this.playerVotedMap = true;
    this.ws.sendMessage('vote-map', new QueueVoteRequestDTO(mapName, this.cookie.get('queue-id')));
  }

  private startTimer(): void {
    if (this.isMapWinner || this.timerRunning || this.winnerCalled) {
      return;
    }

    this.timerRunning = true;
    const intervalId = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(intervalId);
        this.timerRunning = false;
        this.showMapsContainer = false;
        this.callWinner();
        this.getWinner();
      }
    }, 1000);
  }

  private callWinner(): void {
    if (this.winnerCalled) return;

    this.winnerCalled = true; // Marca que o líder já chamou o getWinner

    if (this.decideIfLeader()) {
      console.log("SOU LÍDER");
      this.ws.sendMessage('get-winner-map', this.cookie.get('queue-id'));
    };
  }


  private getWinner() {
    if (this.alreadyGetWinner) return;
        this.alreadyGetWinner = true;
        this.ws.mapWinner.subscribe(mapWinner => {
        this.mapWinner = mapWinner;
        this.isMapWinner = true;
        this.showMapsContainer = false;

        this.ws.matchId.subscribe(matchId => {
          console.log("PARTTIDA ID AGORA: " + matchId)
          this.cookie.set("match-Id", matchId);
        });

          
      setTimeout(() => {
        this.router.navigateByUrl('/anti-cheater');
      }, 5000);

    });
  }

  private decideIfLeader(): boolean {
    const sortedPlayers = this.playersNames.sort();
    const leaderName = sortedPlayers[0];
    return this.cookie.get("username") === leaderName;
  }
}