import { GamesAndBalanceComponent } from './games-and-balance.component';
import { GamesAndBalanceRoutingModule } from './games-and-balance-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule, MatRippleModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatPaginatorModule, MatIconModule, MatTableModule, MatButtonModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { ControlsModule } from 'app/controls/controls.module';
import { GameAndBalanceComponent } from './game-and-balance/game-and-balance.component';

@NgModule({
  declarations: [GamesAndBalanceComponent, GameAndBalanceComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    GamesAndBalanceRoutingModule,
    MatProgressBarModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    FuseSharedModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    ControlsModule,
    MatTabsModule,
    MatTooltipModule

  ]
})
export class GamesAndBalanceModule { }
