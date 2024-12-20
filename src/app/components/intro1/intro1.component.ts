import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { PlayersService } from '../../services/players/players.service';

@Component({
  selector: 'app-intro1',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
  ],
  templateUrl: './intro1.component.html',
  styleUrl: './intro1.component.css',
})
export class Intro1Component implements OnInit {
  players: any[] = [];

  constructor(private playerService: PlayersService) {}

  ngOnInit(): void {
    this.fetchTop10Players();
  }

  fetchTop10Players(): void {
    this.playerService.getTop10Players().subscribe(
      (data: any[]) => {
        this.players = data;
      },
      (error: any) => {
        console.error('Erro ao buscar o Top 10 jogadores:', error);
      }
    );
  }
}
