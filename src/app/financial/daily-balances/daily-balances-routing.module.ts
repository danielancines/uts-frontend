import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DailyBalancesComponent } from './daily-balances.component';
import { RolesGuardService } from 'app/auth/roles-guard.service';
import { AuthGuardService } from 'app/auth/auth-guard.service';
import { Roles } from 'app/auth/roles';
import { DailyBalanceComponent } from './daily-balance/daily-balance.component';

const routes: Routes = [
  {
    path: 'dailybalances',
    component: DailyBalancesComponent,
    canActivate: [RolesGuardService, AuthGuardService],
    data: {
      role: Roles.AccessDailyBalances,
      errorMessageKey: 'DAILY_BALANCES.ERRORS.ACCESS_DAILY_BALANCES.MESSAGE',
      errorTitleKey: 'DAILY_BALANCES.ERRORS.ACCESS_DAILY_BALANCES.TITLE'
    }
  },
  {
    path: 'dailybalances/new',
    component: DailyBalanceComponent,
    canActivate: [RolesGuardService, AuthGuardService],
    data: {
      role: Roles.InsertDailyBalances,
      errorMessageKey: 'DAILY_BALANCES.ERRORS.INSERT_DAILY_BALANCES.MESSAGE',
      errorTitleKey: 'DAILY_BALANCES.ERRORS.INSERT_DAILY_BALANCES.TITLE'
    }
  },
  {
    path: 'dailybalances/:id',
    component: DailyBalanceComponent,
    canActivate: [RolesGuardService, AuthGuardService],
    data: {
      role: Roles.UpdateDailyBalances,
      errorMessageKey: 'DAILY_BALANCES.ERRORS.UPDATE_DAILY_BALANCES.MESSAGE',
      errorTitleKey: 'DAILY_BALANCES.ERRORS.UPDATE_DAILY_BALANCES.TITLE'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyBalancesRoutingModule { }
