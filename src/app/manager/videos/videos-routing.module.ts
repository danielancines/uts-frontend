import { VideoComponent } from './video/video.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideosComponent } from './videos.component';
import { AuthGuardService } from '../../auth/auth-guard.service';
import { RolesGuardService } from '../../auth/roles-guard.service';
import { Roles } from 'app/auth/roles';
import { WatchComponent } from './watch/watch.component';

const routes: Routes = [
  {
    path: 'videos',
    component: VideosComponent,
    canActivate: [RolesGuardService, AuthGuardService],
    data: {
      role: Roles.AccessVideos,
      errorMessageKey: 'VIDEOS_ERRORS.ACCESS_VIDEO.MESSAGE',
      errorTitleKey: 'VIDEOS_ERRORS.ACCESS_VIDEO.TITLE'
    }
  },
  {
    path: 'watchvideo/:id',
    component: WatchComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'videos/new',
    component: VideoComponent,
    canActivate: [RolesGuardService, AuthGuardService],
    data: {
      role: Roles.InsertVideo,
      errorMessageKey: 'VIDEOS_ERRORS.INSERT_VIDEO.MESSAGE',
      errorTitleKey: 'VIDEOS_ERRORS.INSERT_VIDEO.TITLE'
    }
  },
  {
    path: 'videos/:id',
    component: VideoComponent,
    canActivate: [RolesGuardService, AuthGuardService],
    data: {
      role: Roles.UpdateVideo,
      errorMessageKey: 'VIDEOS_ERRORS.UPDATE_VIDEO.MESSAGE',
      errorTitleKey: 'VIDEOS_ERRORS.UPDATE_VIDEO.TITLE'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideosRoutingModule { }
