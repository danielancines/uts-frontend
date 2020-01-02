import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from 'app/manager/users/user.model';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private _logServiceUrl = `${environment.api_url}/userlogs`;
  constructor(
    private _httpClient: HttpClient
  ) { }

  log(action: LogActionType, user: IUser, dataId?) {
    if (!user) return;

    this._httpClient.post(this._logServiceUrl, { action, dataId, userId: user._id }).subscribe();
  }
}

export enum LogActionType {
  WatchedVideo = 'watchedvideo',
  SetWatchedVideo = 'setwatchedvideo',
  SetUnwatchedVideo = 'setunwatchedvideo',
  Login = 'login',
  Logout = 'logout'
};
