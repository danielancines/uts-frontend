import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideosRoutingModule } from './videos-routing.module';
import { VideosComponent } from './videos.component';
import { MatTableModule, MatCheckboxModule, MatIconModule, MatMenuModule, MatToolbarModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressBarModule, MatAutocompleteModule, MatPaginatorModule, MatTabsModule, MatRippleModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { VideoRegistryComponent } from './video-registry/video-registry.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseConfirmDialogModule } from '@fuse/components';
import { RolesGuardService } from '../../auth/roles-guard.service';
import { WatchComponent } from './watch/watch.component';
import { VideoComponent } from './video/video.component';
import { DomChangeDirective } from 'app/shared/util/dom-change.directive';

@NgModule({
  imports: [
    CommonModule,
    VideosRoutingModule,
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
    FuseSharedModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatRippleModule,
    FuseConfirmDialogModule
  ],
  entryComponents: [
    VideoRegistryComponent,
    FuseConfirmDialogComponent
  ],
  declarations: [
    VideosComponent,
    VideoRegistryComponent,
    WatchComponent,
    VideoComponent,
    DomChangeDirective
  ],
  providers: [
    RolesGuardService
  ]
})
export class VideosModule { }
