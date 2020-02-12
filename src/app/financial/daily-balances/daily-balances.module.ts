import { DailyBalancesComponent } from './daily-balances.component';
import { DailyBalancesRoutingModule } from './daily-balances-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule, MatRippleModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatPaginatorModule, MatIconModule, MatTableModule, MatButtonModule, MatTabsModule, MatTooltipModule, MatDatepickerModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { ControlsModule } from 'app/controls/controls.module';
import { DailyBalanceComponent } from './daily-balance/daily-balance.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [DailyBalancesComponent, DailyBalanceComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    DailyBalancesRoutingModule,
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
    MatTooltipModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule
  ]
})
export class DailyBalancesModule { }
