import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RequestsService } from '../../services/requests/requests.service';
import { PlayerResponseDTO } from '../../models/PlayerResponseDTO';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user-services/user.service';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [SidebarComponent, CommonModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css'],
})
export class RankingComponent implements OnInit {
  public players!: PlayerResponseDTO[];
  imageUrls: Map<number, string> = new Map();
  filteredPlayers: PlayerResponseDTO[] = [];

  constructor(private req: RequestsService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadPlayerImages();

    this.req.get<{ content: PlayerResponseDTO[] }>('/v1/players').subscribe(
      (data) => {
        this.players = data.content;
        this.filteredPlayers = this.players.filter(
          (player) => player.points > 0
        );
        console.log('PLAYERS: ' + JSON.stringify(this.players));
        this.loadPlayerImages();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private generateMockPlayers(): PlayerResponseDTO[] {
    return Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      username: `Player${index + 1}`,
      wins: (Math.floor(Math.random() * 10) + 1).toString(),
      losses: (Math.floor(Math.random() * 10) + 1).toString(),
      points: Math.floor(Math.random() * 100) + 1,
      userId: index + 1,
    }));
  }

  public async getImageProfile(userId: number): Promise<string | undefined> {
    try {
      return await this.userService.getImageProfileByUserId(userId);
    } catch (error) {
      console.error('Error fetching image profile:', error);
      return undefined;
    }
  }

  private async loadPlayerImages() {
    for (const player of this.players) {
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
