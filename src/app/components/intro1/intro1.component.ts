import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { PlayersService } from '../../services/players/players.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

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
    MatDialogModule,
  ],
  templateUrl: './intro1.component.html',
  styleUrl: './intro1.component.css',
})
export class Intro1Component implements OnInit {
  players: any[] = [];

  constructor(
    private playerService: PlayersService,
    private dialog: MatDialog
  ) {}

  openAuthModal() {
    this.dialog.open(AuthModalComponent, {
      panelClass: 'auth-modal',
      width: '650px',
    });
  }

  ngOnInit(): void {
    this.fetchTop10Players();
  }

  fetchTop10Players(): void {
    this.playerService.getTop10Players().subscribe(
      (data: any[]) => {
        this.players = data;
      },
      (error: any) => {}
    );
  }
}
