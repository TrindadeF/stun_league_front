import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { RequestsService } from '../../services/requests/requests.service';
import { PointResultDTO } from '../../models/PointResultDTO';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-services/user.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  name: string = '';
  username: string = '';
  points: number = 0;
  imageProfile: string = '';
  imageSrc: string | ArrayBuffer | null = null;
  userId!: number;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private req: RequestsService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    this.name = this.cookie.get('name');
    this.username = this.cookie.get('username');
    this.imageProfile = this.cookie.get('imageProfile');
    this.userId = Number(this.cookie.get('id'));

    try {
      this.imageSrc = await this.userService.getImageProfile();
    } catch (error) {
      console.error('Erro ao baixar imagem de perfil:', error);
    }

    this.req.get<PointResultDTO>('v1/points/' + this.username).subscribe(
      (data: PointResultDTO) => {
        this.points = data.points;
      },
      (error) => {
        this.cookie.deleteAll();
      }
    );
  }

  logout() {
    this.cookie.deleteAll();
    this.router.navigateByUrl('/welcome');
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
