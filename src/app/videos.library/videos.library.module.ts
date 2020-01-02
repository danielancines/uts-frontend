import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatFormFieldModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VideosLibraryRoutingModule } from './videos.library-routing.module';
import { VideosLibraryComponent } from './videos.library.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SharedModule } from 'app/shared/shared.module';
import { ControlsModule } from 'app/controls/controls.module';

@NgModule({
  imports: [
    CommonModule,
    VideosLibraryRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatProgressBarModule,
    MatInputModule,
    FuseSharedModule,
    TranslateModule,
    SharedModule,
    ControlsModule
  ],
  declarations: [VideosLibraryComponent]
})
export class VideosLibraryModule { }
