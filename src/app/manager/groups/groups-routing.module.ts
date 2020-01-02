import { GroupComponent } from './group/group.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsComponent } from './groups.component';
import { AuthGuardService } from 'app/auth/auth-guard.service';
import { RolesGuardService } from 'app/auth/roles-guard.service';
import { Roles } from 'app/auth/roles';

const routes: Routes = [{
  path: 'groups',
  component: GroupsComponent,
  canActivate: [RolesGuardService, AuthGuardService],
  data: {
    role: Roles.AccessGroups,
    errorMessageKey: 'GROUPS_ERRORS.ACCESS_GROUP.MESSAGE',
    errorTitleKey: 'GROUPS_ERRORS.ACCESS_GROUP.TITLE'
  }
},
{
  path: 'groups/new',
  component: GroupComponent,
  canActivate: [RolesGuardService, AuthGuardService],
  data: {
    role: Roles.InsertGroup,
    errorMessageKey: 'GROUPS_ERRORS.INSERT_GROUP.MESSAGE',
    errorTitleKey: 'GROUPS_ERRORS.INSERT_GROUP.TITLE'
  }
},
{
  path: 'groups/:id',
  component: GroupComponent,
  canActivate: [RolesGuardService, AuthGuardService],
  data: {
    role: Roles.UpdateGroup,
    errorMessageKey: 'GROUPS_ERRORS.UPDATE_GROUP.MESSAGE',
    errorTitleKey: 'GROUPS_ERRORS.UPDATE_GROUP.TITLE'
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
