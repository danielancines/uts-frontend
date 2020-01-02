import { MatRippleModule, MatProgressBarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatPaginatorModule, MatIconModule, MatTableModule, MatButtonModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { MoneyRequestsRoutingModule } from './money-requests-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoneyRequestsComponent } from './money-requests.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ControlsModule } from 'app/controls/controls.module';
import { MoneyRequestComponent } from './money-request/money-request.component';

@NgModule({
  declarations: [MoneyRequestsComponent, MoneyRequestComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    MoneyRequestsRoutingModule,
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
export class MoneyRequestsModule { }
