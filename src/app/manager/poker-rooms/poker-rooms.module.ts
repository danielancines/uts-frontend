import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
