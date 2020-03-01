

import { MatRippleModule } from '@angular/material/core';

import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
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
