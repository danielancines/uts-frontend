import { MatProgressBarModule, MatRippleModule, MatIconModule, MatTableModule, MatTabsModule, MatPaginatorModule, MatButtonModule, MatInputModule, MatSelectModule } from '@angular/material';
import { PokerRoomsRoutingModule } from './poker-rooms-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokerRoomsComponent } from './poker-rooms.component';
import { PokerRoomComponent } from './poker-room/poker-room.component';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PokerRoomsComponent, PokerRoomComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    PokerRoomsRoutingModule,
    MatProgressBarModule,
    MatRippleModule,
    MatIconModule,
    TranslateModule,
    MatTableModule,
    MatTabsModule,
    MatSelectModule,
    MatPaginatorModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class PokerRoomsModule { }
