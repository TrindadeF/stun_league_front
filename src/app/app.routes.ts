import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { AuthGuard } from './guards/auth-guard.guard';
import { HomeComponent } from './components/home/home.component';
import { QueueWaitingComponent } from './components/queue-waiting/queue-waiting.component';
import { QueueGuard } from './guards/queue-guard';
import { AntiCheaterComponent } from './components/anti-cheater/anti-cheater.component';
import { matchGuard } from './guards/match.guard';
import { antCheaterGuard } from './guards/ant-cheater-guard';

import { MatchComponent } from './components/match/match.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { MyProfileInformationsComponent } from './components/my-profile-informations/my-profile-informations.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { Intro1Component } from './components/intro1/intro1.component';
import { PlansComponent } from './components/plans/plans.component';

export const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  {
    path: 'queue-waiting',
    component: QueueWaitingComponent,
    canActivate: [QueueGuard],
  },
  {
    path: 'anti-cheater',
    component: AntiCheaterComponent,
    canActivate: [antCheaterGuard],
  },
  { path: 'match', component: MatchComponent, canActivate: [matchGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'my-profile',
    component: MyProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-profile-informations',
    component: MyProfileInformationsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'ranking', component: RankingComponent, canActivate: [AuthGuard] },
  { path: 'intro', component: Intro1Component },
  { path: 'plans', component: PlansComponent },
];
