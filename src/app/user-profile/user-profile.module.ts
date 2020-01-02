import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfileComponent } from './user-profile.component';
import { MatButtonModule, MatDividerModule, MatIconModule, MatTabsModule, MatInputModule, MatSelectModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileAboutComponent } from './tabs/about/about.component';

@NgModule({
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTabsModule,
    TranslateModule,
    MatInputModule,
    MatSelectModule,
    FuseSharedModule
  ],
  declarations: [
    UserProfileComponent,
    ProfileAboutComponent
  ]
})
export class UserProfileModule { }
