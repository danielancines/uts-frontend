import { AuthenticationService } from 'app/auth/authentication.service';
import { UsersService } from 'app/manager/users/users.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { VideosService } from '../videos.service';
import { IVideo } from '../video.model';
import { fuseAnimations } from '@fuse/animations';
import { MessageService } from 'app/shared/message.service';
import { MessageType } from 'app/shared/messageTypes';
import { HelperService } from 'app/shared/util/helper.service';
import { LogService, LogActionType } from 'app/shared/log.service';
import Player from '@vimeo/player';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss'],
  animations: fuseAnimations
})
export class WatchComponent implements OnInit {
  private player;
  videoUrl: SafeResourceUrl;
  videoDetails: string;
  video: IVideo;
  loading: boolean;

  constructor(
    private _sanitizer: DomSanitizer,
    private _route: ActivatedRoute,
    private _videosService: VideosService,
    private _messageService: MessageService,
    private _router: Router,
    private _helperService: HelperService,
    private _authenticationService: AuthenticationService,
    private _userService: UsersService,
    private _logService: LogService) {
  }

  private _isFavorite: boolean;
  set isFavorite(value: boolean) {
    this._isFavorite = value;
    if (this._isFavorite) {
      this.setFavorite();
    } else {
      this.unfavorite();
    }
  }
  get isFavorite(): boolean {
    return this._isFavorite;
  }

  ngOnInit() {
    if (!this._route.snapshot.params.id) {
      return;
    }
    this.loading = true;
    this._videosService.getToWatchById(this._route.snapshot.params.id)
      .subscribe(video => {
        this.videoDetails = this._helperService.htmlfyText(video.details);
        this.video = video;
        this.videoUrl = this._sanitizer.bypassSecurityTrustHtml(this.video.url);
        this.loadVideoFavoriteStatus();
        this._logService.log(LogActionType.WatchedVideo, this._authenticationService.user, this.video._id);
        this.loading = false;
      },
        error => {
          if (error.status == 403) this._messageService.showMessage(MessageType.Warning, 'VIDEOS_ERRORS.FORBIDDEN', '');
          if (error.status == 500) this._messageService.showMessage(MessageType.Error, error.message, 'Code 500');

          this._router.navigate(['home']);
          this.loading = false;
        });
  }

  onDomChange(mutation: MutationRecord) {
    let updateFrequencyCount = 0;
    const updateTimer = 60;
    
    this.player = new Player(mutation.addedNodes[0], {});
    this.player.on('timeupdate', (data) => {
      if (updateFrequencyCount == 0 || updateFrequencyCount / updateTimer >= 1) {
        this._userService.sendVideoStatus(this._authenticationService.user._id, this.video, data).subscribe();
        updateFrequencyCount = 1;
      }
      updateFrequencyCount++;
    });
  }

  private setFavorite() {
    this._userService.setFavoriteVideo(this._authenticationService.user._id, this.video)
      .subscribe(response => {
      },
        error => {

        });
  }

  private unfavorite() {
    this._userService.unfavoriteVideo(this._authenticationService.user._id, this.video)
      .subscribe(response => {
      },
        error => {

        });
  }

  private loadVideoFavoriteStatus() {
    this._userService.getVideoFavoriteStatus(this._authenticationService.user._id, this.video)
      .subscribe(isFavorite => {
        this._isFavorite = isFavorite;
      },
        error => {
          this._messageService.showMessage(MessageType.Error, error.error.message, 'VIDEOS_ERRORS.GETTING_VIDEO_STATUS');
        });
  }
}
