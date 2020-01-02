import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'app/auth/auth-guard.service';
import { RolesGuardService } from 'app/auth/roles-guard.service';
import { Roles } from 'app/auth/roles';
import { MoneyRequestsComponent } from './money-requests.component';
import { MoneyRequestComponent } from './money-request/money-request.component';

const routes: Routes = [
  {
    path: 'moneyrequests',
    component: MoneyRequestsComponent,
    canActivate: [RolesGuardService, AuthGuardService],
    data: {
      role: Roles.AccessMoneyRequests,
      errorMessageKey: 'MONEY_REQUESTS_ERRORS.ACCESS_MONEY_REQUESTS.MESSAGE',
      errorTitleKey: 'MONEY_REQUESTS_ERRORS.ACCESS_MONEY_REQUESTS.TITLE'
    }
  },
  {
    path: 'moneyrequests/:id',
    component: MoneyRequestComponent,
    canActivate: [RolesGuardService, AuthGuardService],
    data: {
      role: Roles.UpdateMoneyRequest,
      errorMessageKey: 'MONEY_REQUESTS_ERRORS.UPDATE_MONEY_REQUESTS.MESSAGE',
      errorTitleKey: 'MONEY_REQUESTS_ERRORS.UPDATE_MONEY_REQUESTS.TITLE'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoneyRequestsRoutingModule { }
