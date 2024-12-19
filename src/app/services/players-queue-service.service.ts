import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RequestsService } from './requests/requests.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PlayersQueueServiceService {


  private playersNumberSubject = new BehaviorSubject<number>(0);
  playersNumber$ = this.playersNumberSubject.asObservable();

  constructor(private req: RequestsService, private router: Router){}

  updatePlayersNumber(playersNumber: number) {
    this.playersNumberSubject.next(playersNumber);
  }

  // inQueue(id: number) {
  //   this.req.get(`v1/queue/in-queue/${id}`).subscribe(
  //     (data: any) => {
  //       console.log(data);
  //       if (data === true) {
  //         this.router.navigateByUrl("/queue-waiting")
  //       }
  //     },
  //     (error: any) => {
  //       console.log(error);
  //     }
  //   );
  // }

}
