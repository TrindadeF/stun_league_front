import { Component, Input } from '@angular/core';
import { TeamNames } from '../../utils/enums/TeamNames';

@Component({
  selector: 'app-winner-screen',
  standalone: true,
  imports: [],
  templateUrl: './winner-screen.component.html',
  styleUrl: './winner-screen.component.css'
})
export class WinnerScreenComponent {
  @Input() winnerTeam!: TeamNames; // Recebe a informação do time vencedor do componente pai

}
