import { Injectable } from '@angular/core';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatchResponseTopicsDTO } from '../../models/MatchResponseTopicsDTO';
import { BlackKey } from '../../models/BlackKey';
import { TeamsMatch } from '../../models/TeamsMatch';
import { VotesTeam } from '../../models/VotesTeam';
import { TeamNames } from '../../utils/enums/TeamNames';

@Injectable({
  providedIn: 'root'
})
export class WebSocketMatchService {
  private stompClient: CompatClient | null = null;
  private subscriptions: Map<string, any> = new Map();
  public isConnected = new BehaviorSubject<boolean>(false);


  public quantityPlayers = new Subject<number>();
  public quantityPlayersConfirmedToStart = new Subject<number>();
  public votesAbort = new Subject<number>();

  public teams = new Subject<TeamsMatch>();
  public voteTeamWinner = new Subject<{}>();
  public teamWinner = new Subject<TeamNames>();

  public blackKey = new Subject<BlackKey>();
  public mapGame = new Subject<string>();

  public votesTeam = new Subject<VotesTeam>();



  constructor(private cookie: CookieService) {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection() {
    const socket = new WebSocket('ws://localhost:8080/stun-matches');
    this.stompClient = Stomp.over(socket);

  this.stompClient.connect({}, (frame: any) => {
    console.log('Conectado ao WebSocket:', frame);
    this.isConnected.next(true);
  }, this.onError.bind(this));
}

public subscribeTopic(oldTopic: any, newTopic: any) {
  this.resetSubjects();
  if (oldTopic === null) {
    console.log("Inscrevendo no novo tópico: " + newTopic);
    const subscription = this.stompClient?.subscribe(newTopic, this.onMessageReceived.bind(this));
    if (subscription) {
      this.subscriptions.set(newTopic, subscription);
    }
  } else {
    console.log("Desinscrevendo do tópico: ", oldTopic);
    this.unsubscribeTopic(oldTopic);

    console.log("Inscrevendo no novo tópico: " + newTopic);
    const subscription = this.stompClient?.subscribe(newTopic, this.onMessageReceived.bind(this));
    if (subscription) {
      this.subscriptions.set(newTopic, subscription);
    }
  }

}

  public connect() {
    const socket = new WebSocket('ws://localhost:8080/stun-queues');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame: any) => {
    console.log('Conectado ao WebSocket:', frame);
    this.isConnected.next(true);
  }, this.onError.bind(this));
  }

  public unsubscribeTopic(topic: string) {
    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
    } else {
      console.log("Nenhuma inscrição encontrada para o tópico: " + topic);
    }
  }

  public disconect() {
    this.stompClient?.disconnect();
  }

  public sendMessage(topic: string, message: Object) {
    if (this.stompClient) {
      const messageAsString = JSON.stringify(message);
      console.log('Enviando mensagem:', messageAsString);
      this.stompClient.send(`/app/${topic}`, {}, messageAsString);
    } else {
      console.log("Não há conexão STOMP ativa")
    }
  }

  

  private onMessageReceived(message: any) {
    const result: MatchResponseTopicsDTO = JSON.parse(message.body) as MatchResponseTopicsDTO;
    console.log("ID TESTE: " + result.matchId)
    console.log("MENSAGEM " + JSON.stringify(result))
    try {

      const quantityPlayers = result.quantityPlayers;
      const quantityPlayersConfirmedToStart = result.quantityPlayersConfirmedToStart;
      const votesAbort = result.votesAbort;
      const teams = result.teams;
      const voteTeamWinner = result.voteTeamWinner;
      const teamWinner = result.teamWinner;
      const blackKey = result.blackKey;
      const mapGame = result.mapGame;
      const votesTeam = result.votesTeam;



      this.quantityPlayers.next(quantityPlayers);
      this.quantityPlayersConfirmedToStart.next(quantityPlayersConfirmedToStart);
      this.votesAbort.next(votesAbort);
      this.teams.next(teams)
      this.voteTeamWinner.next(voteTeamWinner);
      this.teamWinner.next(teamWinner);
      this.blackKey.next(blackKey);
      this.mapGame.next(mapGame);
      this.votesTeam.next(votesTeam);


      
    } catch (e) {
      console.error('Erro ao analisar mensagem:', e);
    }
  }

  private onError(error: any) {
    console.error('Erro de WebSocket:', error);
  }
  private resetSubjects() {
  }
}
