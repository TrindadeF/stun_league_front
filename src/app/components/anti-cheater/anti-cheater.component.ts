import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WebSocketMatchService } from '../../services/socket/web-socket-match.service';
import { CookieService } from 'ngx-cookie-service';
import { PlayerResponseDTO } from '../../models/PlayerResponseDTO';
import { RequestsService } from '../../services/requests/requests.service';
import { PlayerJoinQueueDTO } from '../../models/PlayerJoinQueueDTO';
import { BlackKey } from '../../models/BlackKey';
import { MatchCancelRequestDTO } from '../../models/MatchCancelRequestDTO';
import { Utils } from '../../utils/utils';
import { MatchRequestDTO } from '../../models/MatchRequestDTO';

@Component({
  selector: 'app-anti-cheater',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './anti-cheater.component.html',
  styleUrl: './anti-cheater.component.css'
})
export class AntiCheaterComponent implements OnInit, OnDestroy {
  containerKeysIsVisible: boolean = false;
  playerResponseDTO!: PlayerResponseDTO;
  blackKey!: BlackKey;
  dots: number[] = Array(10).fill(0);
  playersConfirmedToStart!: number;
  alreadyConfirm: boolean = false;
  matchId!: string;
  playerId!: number;
  players!: [];
  timer: number = 30; // Adicionado para o timer em segundos
  private intervalId: any;
  private localStorageKey = 'matchTimer'; // Chave para armazenar no localStorage




  constructor(
    private router: Router, 
    private ws: WebSocketMatchService, 
    private cookie: CookieService,
    private req: RequestsService

  ) {}

  ngOnInit(): void {
    this.matchId = this.cookie.get("match-Id");
    this.playerId = Number(this.cookie.get("id"));

    this.ws.isConnected.subscribe((connected) => {
      if (connected) {

        console.log('MATCH ID:  '+ this.matchId)
        console.log("BLACK KEY: " + this.blackKey)

        this.ws.subscribeTopic(null, `/topic/match/${this.matchId}`);
        this.ws.sendMessage("update", new MatchRequestDTO(this.matchId, this.playerId));

        // this.joinMatch();

        this.ws.quantityPlayers.subscribe((players: number) => {
          console.log("match players: " + players);
        });

        this.ws.blackKey.subscribe((blackKey: BlackKey) => {
          console.log("BLACK KEY: " + JSON.stringify(blackKey))
          this.blackKey = blackKey;
        });

        this.ws.blackKey.subscribe((blackKey: BlackKey) => {
          console.log("BLACK KEY: " + JSON.stringify(blackKey))
          this.blackKey = blackKey;
        });

    
        this.ws.quantityPlayersConfirmedToStart.subscribe((playersConfirmed: number) => {
          this.playersConfirmedToStart = playersConfirmed;
          if (this.playersConfirmedToStart === Utils.MAX_PLAYERS_TO_START && this.alreadyConfirm) {
            console.log("começou");
            this.cookie.delete("queue-id");
            this.router.navigateByUrl("/match");
          }
        });
        this.initializeTimer();

      }
  });
}

  // joinMatch() {
  //   const username = this.cookie.get("username");
  //   this.req.get<PlayerResponseDTO>(`v1/players/username/${username}`)
  //     .subscribe((data: PlayerResponseDTO) => {
  //       this.playerResponseDTO = data;
  //       const playerJoin = new PlayerJoinQueueDTO();
  //       playerJoin.playerResponseDTO = this.playerResponseDTO;
  //       playerJoin.queueId = this.matchId;
  //       this.ws.sendMessage("join-match", playerJoin);
  //     });
  // }

  ngOnDestroy(): void {
    this.ws.unsubscribeTopic(`/topic/match/${this.matchId}`);
    clearInterval(this.intervalId);
  }

  confirmToStart(): void { // Corrigido o nome do método
    this.alreadyConfirm = true;
    const matchRequest = new MatchRequestDTO(this.matchId, this.playerId);
    console.log("MATCH REQUEST: " + JSON.stringify(matchRequest));
    this.ws.sendMessage("start", new MatchRequestDTO(this.matchId, this.playerId));
  }

  public openBoxBlackSecurityKeys(): void {
    this.containerKeysIsVisible = true;
  }

  public closeBoxBlackSecurityKeys(): void {
    this.containerKeysIsVisible = false;
  }

  initializeTimer(): void {
    // Recupera o tempo restante do localStorage, se houver
    const savedTimer = localStorage.getItem(this.localStorageKey);
    console.log(savedTimer);
    if (savedTimer) {
      this.timer = Number(savedTimer);
    }

    this.startTimer();
  }

  startTimer(): void {
    this.intervalId = setInterval(() => {
      this.timer--;
      localStorage.setItem(this.localStorageKey, this.timer.toString()); // Salva o tempo restante no localStorage

      if (this.timer <= 0) {
        clearInterval(this.intervalId);
        localStorage.removeItem(this.localStorageKey); // Limpa o localStorage quando o tempo acabar

        if (this.playersConfirmedToStart < 7) {
          this.ws.sendMessage("cancel-match", this.matchId);
          this.router.navigateByUrl("/home");
        }
      }
    }, 1000); // Atualiza a cada segundo (1000 ms)
  }

}