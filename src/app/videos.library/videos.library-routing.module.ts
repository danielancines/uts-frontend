import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideosLibraryComponent } from './videos.library.component';
import { AuthGuardService } from '../auth/auth-guard.service';

const routes: Routes = [
  {
    path: 'videoslibrary',
    component: VideosLibraryComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideosLibraryRoutingModule { }
