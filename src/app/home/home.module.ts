import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MatButtonModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatPaginatorModule, MatInputModule, MatDatepickerModule, MatAutocompleteModule, MatTooltipModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    FuseSharedModule,
    FuseWidgetModule,
    CommonModule,
    HomeRoutingModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    NgxChartsModule,
    TranslateModule,
    MatPaginatorModule,
    MatInputModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatTooltipModule
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }
