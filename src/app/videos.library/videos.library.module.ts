import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VideosLibraryRoutingModule } from './videos.library-routing.module';
import { VideosLibraryComponent } from './videos.library.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
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
    MatPaginatorModule,
    MatInputModule,
    FuseSharedModule,
    TranslateModule,
    SharedModule,
    ControlsModule
  ],
  declarations: [VideosLibraryComponent]
})
export class VideosLibraryModule { }
