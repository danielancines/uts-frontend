import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesAndBalanceComponent } from './games-and-balance.component';
import { RolesGuardService } from 'app/auth/roles-guard.service';
import { AuthGuardService } from 'app/auth/auth-guard.service';
import { Roles } from 'app/auth/roles';
import { GameAndBalanceComponent } from './game-and-balance/game-and-balance.component';

const routes: Routes = [
  {
    path: 'gamesandbalance',
    component: GamesAndBalanceComponent,
    canActivate: [RolesGuardService, AuthGuardService],
    data: {
      role: Roles.AccessGamesAndBalance,
      errorMessageKey: 'GAMES_AND_BALANCE.ERRORS.ACCESS_GAMES_AND_BALANCE.MESSAGE',
      errorTitleKey: 'GAMES_AND_BALANCE.ERRORS.ACCESS_GAMES_AND_BALANCE.TITLE'
    }
  },
  {
    path: 'gamesandbalance/:id',
    component: GameAndBalanceComponent,
    canActivate: [RolesGuardService, AuthGuardService],
    data: {
      role: Roles.UpdateGamesAndBalance,
      errorMessageKey: 'GAMES_AND_BALANCE.ERRORS.UPDATE_GAMES_AND_BALANCE.MESSAGE',
      errorTitleKey: 'GAMES_AND_BALANCE.ERRORS.UPDATE_GAMES_AND_BALANCE.TITLE'
    }
  },
  {
    path: 'gamesandbalance/new',
    component: GameAndBalanceComponent,
    canActivate: [RolesGuardService, AuthGuardService],
    data: {
      role: Roles.InsertGamesAndBalance,
      errorMessageKey: 'GAMES_AND_BALANCE.ERRORS.INSERT_GAMES_AND_BALANCE.MESSAGE',
      errorTitleKey: 'GAMES_AND_BALANCE.ERRORS.INSERT_GAMES_AND_BALANCE.TITLE'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesAndBalanceRoutingModule { }
