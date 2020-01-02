import { PokerRoomsComponent } from './poker-rooms.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'app/auth/auth-guard.service';
import { RolesGuardService } from 'app/auth/roles-guard.service';
import { Roles } from 'app/auth/roles';
import { PokerRoomComponent } from './poker-room/poker-room.component';

const routes: Routes = [{
  path: 'pokerrooms',
  component: PokerRoomsComponent,
  canActivate: [RolesGuardService, AuthGuardService],
  data: {
    role: Roles.AccessPokerRooms,
    errorMessageKey: 'POKER_ROOMS_ERRORS.ACCESS_POKER_ROOM.MESSAGE',
    errorTitleKey: 'POKER_ROOMS_ERRORS.ACCESS_POKER_ROOM.TITLE'
  }
},
{
  path: 'pokerrooms/new',
  component: PokerRoomComponent,
  canActivate: [RolesGuardService, AuthGuardService],
  data: {
    role: Roles.InsertPokerRoom,
    errorMessageKey: 'POKER_ROOMS_ERRORS.INSERT_POKER_ROOM.MESSAGE',
    errorTitleKey: 'POKER_ROOMS_ERRORS.INSERT_POKER_ROOM.TITLE'
  }
},
{
  path: 'pokerrooms/:id',
  component: PokerRoomComponent,
  canActivate: [RolesGuardService, AuthGuardService],
  data: {
    role: Roles.UpdatePokerRoom,
    errorMessageKey: 'POKER_ROOMS_ERRORS.UPDATE_POKER_ROOM.MESSAGE',
    errorTitleKey: 'POKER_ROOMS_ERRORS.UPDATE_POKER_ROOM.TITLE'
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PokerRoomsRoutingModule { }
