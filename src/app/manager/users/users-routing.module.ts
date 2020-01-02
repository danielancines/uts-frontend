import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { AuthGuardService } from 'app/auth/auth-guard.service';
import { RolesGuardService } from 'app/auth/roles-guard.service';
import { Roles } from 'app/auth/roles';
import { UserComponent } from './user/user.component';

const routes: Routes = [{
  path: 'users',
  component: UsersComponent,
  canActivate: [RolesGuardService, AuthGuardService],
  data: {
    role: Roles.AccessUsers,
    errorMessageKey: 'USERS_ERRORS.ACCESS_USER.MESSAGE',
    errorTitleKey: 'USERS_ERRORS.ACCESS_USER.TITLE'
  }
},
{
  path: 'users/new',
  component: UserComponent,
  canActivate: [RolesGuardService, AuthGuardService],
  data: {
    role: Roles.InsertUser,
    errorMessageKey: 'USERS_ERRORS.INSERT_USER.MESSAGE',
    errorTitleKey: 'USERS_ERRORS.INSERT_USER.TITLE'
  }
},
{
  path: 'users/:id',
  component: UserComponent,
  canActivate: [RolesGuardService, AuthGuardService],
  data: {
    role: Roles.UpdateUser,
    errorMessageKey: 'USERS_ERRORS.UPDATE_USER.MESSAGE',
    errorTitleKey: 'USERS_ERRORS.UPDATE_USER.TITLE'
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
