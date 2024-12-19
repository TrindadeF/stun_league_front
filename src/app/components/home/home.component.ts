import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HeaderComponent } from "../header/header.component";
import { RequestsService } from '../../services/requests/requests.service';
import { CookieService } from 'ngx-cookie-service';
import { PlayerResponseDTO } from '../../models/PlayerResponseDTO';
import { FormsModule } from '@angular/forms';
import { WebSocketQueueService } from '../../services/socket/web-socket-queue.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PlayerJoinQueueDTO } from '../../models/PlayerJoinQueueDTO';
import { UUID } from 'node:crypto';
import { Utils } from '../../utils/utils';
import { MatchService } from '../../services/match/match.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  playerResponseDTO!: PlayerResponseDTO;
  players: number = 0;
  queueSwitch: boolean = false;
  alreadySubscribed: boolean = false;
  playersNames: string[] = [];
  isButtonDisabled: boolean = false;
  private queueIdFetching: boolean = false;

  constructor(
    private ws: WebSocketQueueService,
    private req: RequestsService,
    private cookie: CookieService,
    private router: Router,
    private matchService: MatchService
  ) {}

  ngOnInit() {
    this.matchService.isInMatch();
    this.initializeWebSocketConnection();
  }

  ngOnDestroy() {
  }

  private initializeWebSocketConnection() {
      this.ws.isConnected.subscribe((connected) => {
        if (connected) {
          this.fetchQueueId();
        }
      })
  }

  private fetchQueueId() {
    if (this.queueIdFetching) return;
    this.queueIdFetching = true;
      this.req.get<{ queueId: UUID }>("/v1/queues")
        .subscribe(
          (data) => {
            this.queueIdFetching = false;
            this.cookie.set("queue-id", String(data));
            this.setupWebSocketSubscriptions();
          },
          (error) => {
            console.log(error);
            this.queueIdFetching = false;
          }
        )
  }

  private setupWebSocketSubscriptions() {
    const queueId = this.cookie.get("queue-id");
    console.log("QUEUE ID " + queueId)
    this.ws.subscribeTopic(null, `/topic/queue/${queueId}`);

      this.ws.messageReceived.subscribe((players: number) => {
        this.players = players;
        if (players >= Utils.MAX_PLAYERS_TO_START && !this.alreadySubscribed) {
            this.ws.playersNames.subscribe((playersNames: string[]) => {
              this.playersNames = playersNames;
              if (this.playersNames.length >= Utils.MAX_PLAYERS_TO_START) {
                if (!this.playersNames.includes(this.cookie.get("username")) && !this.queueSwitch) {
                  this.switchQueue();
                  this.queueSwitch = true;
                }
              }
              this.alreadySubscribed = true;
            })
        }
      })
  }

  public joinQueue() {
    if (this.queueIdFetching) return;
  
    this.isButtonDisabled = true;
    this.ws.sendMessage("get", this.cookie.get("queue-id"));
    const username = this.cookie.get("username");
    this.req.get<PlayerResponseDTO>(`v1/players/username/${username}`)
      .subscribe((data: PlayerResponseDTO) => {
        this.playerResponseDTO = data;
        
        const playerJoin = new PlayerJoinQueueDTO();
        playerJoin.playerResponseDTO = this.playerResponseDTO;
        playerJoin.queueId = this.cookie.get("queue-id");
        
        this.ws.sendMessage("join", playerJoin);
        
        setTimeout(() => {
          this.router.navigate(['/queue-waiting'], { state: { player: this.playerResponseDTO } });
          this.isButtonDisabled = false;
        }, 100);
      });
  }

  public isPlayerInQueue(): boolean {
    const playerName = this.cookie.get('username');
    return this.playersNames.includes(playerName);
  }

  private switchQueue() {
      this.req.get<string>("/v1/queues")
        .subscribe(
          (data: string) => {
            const oldQueueId = this.cookie.get("queue-id");
            this.cookie.set("queue-id", data);
            this.ws.subscribeTopic(`/topic/queue/${oldQueueId}`, `/topic/queue/${data}`);
          },
          (error) => {
            console.log(error);
          }
    );
  }
}
