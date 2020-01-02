import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatCheckboxModule, MatIconModule, MatMenuModule, MatToolbarModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressBarModule, MatPaginatorModule, MatChipsModule, MatTabsModule, MatRippleModule } from '@angular/material';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule } from '@fuse/components';
import { UserRegistryComponent } from './user-registry/user-registry.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { UserComponent } from './user/user.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatTabsModule,
    MatCheckboxModule,
    MatChipsModule,
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
    MatRippleModule,
    FuseConfirmDialogModule,
    UsersRoutingModule,
    SharedModule
  ],
  entryComponents: [
    UserRegistryComponent,
    FuseConfirmDialogComponent
  ],
  declarations: [
    UsersComponent,
    UserRegistryComponent,
    UserComponent
  ]
})
export class UsersModule { }
