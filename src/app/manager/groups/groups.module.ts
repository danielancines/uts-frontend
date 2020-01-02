import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatCheckboxModule, MatIconModule, MatMenuModule, MatToolbarModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressBarModule, MatPaginatorModule, MatTabsModule, MatRippleModule } from '@angular/material';
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './groups.component';
import { GroupRegistryComponent } from './group-registry/group-registry.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';
import { ColorPickerModule } from 'ngx-color-picker';
import { GroupComponent } from './group/group.component';

@NgModule({
  imports: [
    CommonModule,
    GroupsRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatTabsModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    FuseSharedModule,
    MatProgressBarModule,
    FuseConfirmDialogModule,
    MatRippleModule,
    ColorPickerModule
  ],
  entryComponents: [
    GroupRegistryComponent,
    FuseConfirmDialogComponent
  ],
  declarations: [GroupsComponent, GroupRegistryComponent, GroupComponent]
})
export class GroupsModule { }
