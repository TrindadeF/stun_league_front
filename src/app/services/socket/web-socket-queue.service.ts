import { Injectable } from '@angular/core';
import {CompatClient} from '@stomp/stompjs';
import { EventEmitter } from 'node:stream';
import { Stomp } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Console } from 'node:console';
import { CookieService } from 'ngx-cookie-service';
import { QueueResponseTopicsDTO } from '../../models/QueueResponseTopicsDTO';

@Injectable({
  providedIn: 'root'
})
export class WebSocketQueueService {

  private stompClient: CompatClient | null = null;
  private subscriptions: Map<string, any> = new Map();
  public isConnected = new BehaviorSubject<boolean>(false);
  public messageReceived = new Subject<any>();
  public messageQueueConfirm = new Subject<number>();
  public queueId = new Subject<string>();
  public mapsVoted = new Subject<{}>();
  public mapWinner = new Subject<string>();
  public matchId = new Subject<string>();
  public playersNames = new Subject<[]>();


  constructor(private cookie: CookieService) {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection() {
    const socket = new WebSocket('ws://localhost:8080/stun-queues');
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
    const result: QueueResponseTopicsDTO = JSON.parse(message.body) as QueueResponseTopicsDTO;
    console.log("ID TESTE: " + result.queueId)
    try {

      const queuePlayersNames = result.playersNamesInQueue;
      const queuePlayers = result.quantityPlayers;
      const queueConfirmedPlayers = result.quantityPlayersConfirmedInQueue;
      const queueId = result.queueId;
      const mapsVoted = result.mapsVotes;
      const mapWinner = result.mapWinner;
      const matchId = result.matchId;
      console.log("PLAYERS: " + queuePlayers)

      this.messageReceived.next(queuePlayers);
      this.messageQueueConfirm.next(queueConfirmedPlayers);
      this.queueId.next(queueId.toString());
      this.mapsVoted.next(mapsVoted)
      this.mapWinner.next(mapWinner);
      this.playersNames.next(queuePlayersNames);
      this.matchId.next(matchId);


    } catch (e) {
      console.error('Erro ao analisar mensagem:', e);
    }
  }

  private onError(error: any) {
    console.error('Erro de WebSocket:', error);
  }
  private resetSubjects() {
    this.messageReceived = new Subject<any>();
    this.messageQueueConfirm = new Subject<number>();
    this.queueId = new Subject<string>();
    this.mapsVoted = new Subject<{}>();
    this.mapWinner = new Subject<string>();
    this.playersNames = new Subject<[]>();
  }
}