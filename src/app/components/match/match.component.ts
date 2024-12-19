import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { WebSocketMatchService } from '../../services/socket/web-socket-match.service';
import { CookieService } from 'ngx-cookie-service';
import { TeamsMatch } from '../../models/TeamsMatch';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlackKey } from '../../models/BlackKey';
import { MatchRequestDTO } from '../../models/MatchRequestDTO';
import { Subscription, timer } from 'rxjs';
import { AbortScreenComponent } from "../abort-screen/abort-screen.component";
import { Router } from '@angular/router';
import { MatchRequestVoteTeamDTO } from '../../models/MatchRequestVoteTeamDTO';
import { TeamNames } from '../../utils/enums/TeamNames';
import { VotesTeam } from '../../models/VotesTeam';
import { WinnerScreenComponent } from "../winner-screen/winner-screen.component";
import { Utils } from '../../utils/utils';
import { UserService } from '../../services/user-services/user.service';

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule, AbortScreenComponent, WinnerScreenComponent],
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit, OnDestroy {
  teams: TeamsMatch = { bl: [], gr: [] };
  mockTeams: TeamsMatch = {
    bl: [
        { id: 1, username: 'PlayerBL1', wins: '5', losses: '2', points: 150, userId: 101 },
        { id: 2, username: 'PlayerBL2', wins: '3', losses: '4', points: 120, userId: 102 },
        { id: 3, username: 'PlayerBL3', wins: '4', losses: '3', points: 140, userId: 103 },
        { id: 4, username: 'PlayerBL4', wins: '2', losses: '5', points: 110, userId: 104 },
        { id: 5, username: 'PlayerBL5', wins: '1', losses: '6', points: 90, userId: 105 },
    ],
    gr: [
        { id: 6, username: 'PlayerGR1', wins: '6', losses: '1', points: 160, userId: 106 },
        { id: 7, username: 'PlayerGR2', wins: '5', losses: '2', points: 150, userId: 107 },
        { id: 8, username: 'PlayerGR3', wins: '4', losses: '3', points: 140, userId: 108 },
        { id: 9, username: 'PlayerGR4', wins: '3', losses: '4', points: 130, userId: 109 },
        { id: 10, username: 'PlayerGR5', wins: '2', losses: '5', points: 110, userId: 110 },
    ]
  };
  mapGame!: string;
  myUsername!: string;
  blackKey!: BlackKey;
  votesToAbort: number = 0;
  matchId!: string;
  playerId!: number;
  alreadyVotedToAbort: boolean = false;
  isLeader: boolean = false;
  showAbortComponent: boolean = false;
  alreadyVotedTeamGR: boolean = false;
  alreadyVotedTeamBL: boolean = false;
  matchRequestVoteTeamDTO!: MatchRequestVoteTeamDTO;
  TeamNames = TeamNames;
  votesTeams!: VotesTeam;
  teamWinner!: TeamNames;
  alreadyGetWinnerTeam: boolean = false;
  resetedVotesTeams: boolean = false;

  alreadyFinishedMatch: boolean = false;
  alreadyStartedMatch: boolean = false;
  imageUrls: Map<number, string> = new Map(); // Armazena URLs das imagens
  maxVotesToAbort = Utils.MAX_VOTES_TO_ABORT_MATCH;
  maxVotesToWinTeam = Utils.MAX_PLAYERS_TO_GET_WINNER_TEAM;





  private votesAbortSubscription: Subscription | null = null;
  private timeoutSubscription: Subscription | null = null;
  private readonly VOTING_TIMEOUT = 1 * 60 * 1000; // 1 minuto em milissegundos

  constructor(private ws: WebSocketMatchService, private cookie: CookieService, private router: Router, private userServices: UserService) {}

  ngOnInit(): void {
    var matchId = this.cookie.get("match-Id");
    this.matchId = matchId;
    console.log("MATCH ID DE NOVO: " + this.matchId);
    this.playerId = Number(this.cookie.get("id"));
    this.myUsername = this.cookie.get("username");

    this.ws.isConnected.subscribe((connected) => {
      if (connected) {
        this.ws.subscribeTopic(null, `/topic/match/${this.matchId}`);
        this.ws.sendMessage("get-teams", this.matchId);
        this.ws.teams.subscribe((teams: TeamsMatch) => {
          this.teams = teams;
          console.log("TIMES: " + teams);
          console.log("TIME A: " + teams.bl);
          console.log("TIME B: " + teams.gr);
          this.isLeader = this.decideIfLeader();
          console.log("SOU LIDER? " + this.isLeader)
          this.alreadyStartedMatch = true;
          this.loadPlayerImages();
        });

        this.ws.mapGame.subscribe((mapGame: string) => {
          this.mapGame = mapGame;
        });

        this.ws.blackKey.subscribe((blackKey: BlackKey) => {
          this.blackKey = blackKey;
        });

        this.ws.votesTeam.subscribe((votesTeams: VotesTeam) => {
          this.votesTeams = votesTeams;

          if (this.votesTeams.votesTeamBL === Utils.MAX_PLAYERS_TO_GET_WINNER_TEAM || this.votesTeams.votesTeamGR === Utils.MAX_PLAYERS_TO_GET_WINNER_TEAM) {
            if (this.isLeader && !this.alreadyGetWinnerTeam) {
              this.ws.sendMessage("get-match-winner", this.matchId);
              this.isLeader = false;
            }
            this.alreadyFinishedMatch = true;
            this.alreadyGetWinnerTeam = true;
            setTimeout(() => {
              this.alreadyGetWinnerTeam = true;
              this.cookie.delete("match-Id");
              this.router.navigateByUrl("/home")
            }, 2000);
          } else {
            if (this.alreadyStartedMatch && !this.alreadyFinishedMatch) {
              console.log("RESETANDO PARTIDAS")
              setTimeout(() => {
                if (this.isLeader) {
                  this.ws.sendMessage("/reset-votes-teams", this.matchId);
                  console.log('RESETANDO');
                }
                this.alreadyVotedTeamBL = false;
                this.alreadyVotedTeamGR = false;
      
            }, 30000);
            }
          };

          console.log("ESTADOS DOS BOTOES: " + this.alreadyVotedTeamBL + " " + this.alreadyVotedTeamGR)
        });


        this.ws.teamWinner.subscribe((teamWinner: TeamNames) => {
          this.teamWinner = teamWinner;
        });

        this.votesAbortSubscription = this.ws.votesAbort.subscribe((votesAbort: number) => {
          this.votesToAbort = votesAbort ?? 0;
          if (this.votesToAbort >= Utils.MAX_VOTES_TO_ABORT_MATCH) {
            this.showAbortComponent = true;
            if (!this.alreadyFinishedMatch && this.alreadyStartedMatch) {

              setTimeout(() => {
                if (this.isLeader) {
                  setTimeout(() => {
                    console.log("SOU LIDER!!! PARA ABORTAR")
                    this.ws.sendMessage("cancel-match", this.matchId);
                  }, 3000)
                } else {
                  console.log("não SOU LIDER!!! PARA ABORTAR")
                }
                this.alreadyFinishedMatch = true;
                this.cookie.delete("match-Id");
                this.router.navigateByUrl("/home");
              }, 2000);
            }
          }
          this.checkVotingTimeout();
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.votesAbortSubscription) {
      this.votesAbortSubscription.unsubscribe();
    }
    if (this.timeoutSubscription) {
      this.timeoutSubscription.unsubscribe();
    }

    this.ws.unsubscribeTopic(`/topic/match/${this.matchId}`);
  }

  public voteToAbort(): void {
    if (!this.alreadyVotedToAbort) {
      const matchRequest: MatchRequestDTO = new MatchRequestDTO(this.matchId, this.playerId);
      this.ws.sendMessage("/vote-abort", matchRequest);
      this.alreadyVotedToAbort = true;
      this.startVotingTimer();
    }
  }

  public voteTeam(teamNames: TeamNames) {
    switch (teamNames) {
      case TeamNames.BL: {
        this.alreadyVotedTeamBL = true;
        this.matchRequestVoteTeamDTO = new MatchRequestVoteTeamDTO(this.matchId, TeamNames.BL, this.playerId);
        this.ws.sendMessage("/vote-team", this.matchRequestVoteTeamDTO);
        break; 
      }
      case TeamNames.GR: {
        this.alreadyVotedTeamGR = true;
        this.matchRequestVoteTeamDTO = new MatchRequestVoteTeamDTO(this.matchId, TeamNames.GR, this.playerId);
        this.ws.sendMessage("/vote-team", this.matchRequestVoteTeamDTO);
        break; 
      }
      default: {
        console.error(`Ocorreu um erro: ${teamNames}`);
        break;
      }
    }

  }


  private startVotingTimer(): void {
    if (this.timeoutSubscription) {
      this.timeoutSubscription.unsubscribe();
    }
    this.timeoutSubscription = timer(this.VOTING_TIMEOUT).subscribe(() => {
      console.log("teste")
      this.allowVotingAgain();
    });
  }

  private allowVotingAgain(): void {
    this.alreadyVotedToAbort = false;
    if (this.timeoutSubscription) {
      this.timeoutSubscription.unsubscribe();
    }
    if (this.isLeader) {
      this.ws.sendMessage("/reset-votes-abort", this.matchId);
    }
  }

  private checkVotingTimeout(): void {
    if (this.votesToAbort > 0 && this.votesToAbort < 7) {
      this.startVotingTimer();
    } else if (this.timeoutSubscription) {
      this.timeoutSubscription.unsubscribe();
    }
  }

  private decideIfLeader(): boolean {
    const allPlayers = this.teams.bl.concat(this.teams.gr);
    const minPlayerId = Math.min(...allPlayers.map(player => player.id));
    return this.playerId === minPlayerId;
  }

  public async getImageProfile(userId: number): Promise<string | undefined> {
    try {
      return await this.userServices.getImageProfileByUserId(userId);
    } catch (error) {
      console.error('Error fetching image profile:', error);
      return undefined;
    }
  }

  private async loadPlayerImages() {
    for (const player of this.teams.bl) {
      try {
        const imageUrl = await this.getImageProfile(player.userId);
        if (imageUrl) {
          this.imageUrls.set(player.userId, imageUrl);
        }
      } catch (error) {
        console.error('Error loading image for user:', player.userId, error);
      }
    }

    for (const player of this.teams.gr) {
      try {
        const imageUrl = await this.getImageProfile(player.userId);
        if (imageUrl) {
          this.imageUrls.set(player.userId, imageUrl);
        }
      } catch (error) {
        console.error('Error loading image for user:', player.userId, error);
      }
    }
  }
}
