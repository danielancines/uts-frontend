import { Injectable } from '@angular/core';
import { IGroup } from '../groups/group.model';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';
import { IUser } from './user.model';
import * as _ from 'lodash';
import { IService } from 'app/shared/base/IService';
import { IVideo } from '../videos/video.model';


@Injectable({
  providedIn: 'root'
})
export class UsersService implements IService {
  private _usersUrl = `${environment.api_url}/users`;

  constructor(private _httpClient: HttpClient) { }

  get(query: string = ''): Observable<{ count: number, data: IUser[] }> {
    const url = _.isEmpty(query) ? this._usersUrl : `${this._usersUrl}${query}`;

    return this._httpClient.get<any>(url)
      .pipe(map((usersResponse) => {
        return {
          count: usersResponse.count,
          data: usersResponse.data
        };
      }),
        catchError(error => {
          return [];
        })
      )
  }

  getById(id: string): Observable<IUser> {
    const url = `${this._usersUrl}/${id}`;

    return this._httpClient.get<any>(url)
      .pipe(map((usersResponse) => {
        return usersResponse.data;
      }),
        catchError(error => {
          return of({});
        })
      )
  }

  add(user: IUser): Observable<IUser> {
    return this._httpClient.post<any>(this._usersUrl, user)
      .pipe(map(userResponse => {
        return userResponse.data;
      }));
  }

  update(user: IUser): Observable<boolean> {
    return this._httpClient.put<any>(`${this._usersUrl}/${user._id}`, user)
      .pipe(map(response => {
        return true;
      }))
  }

  delete(user: IUser): Observable<boolean> {
    return this._httpClient.delete<any>(`${this._usersUrl}/${user._id}`);
  }

  getGroups(id): Observable<IGroup[]> {
    return this._httpClient.get<any>(`${this._usersUrl}/${id}/groups`)
      .pipe(map((userGroupsResponse) => {
        return userGroupsResponse.data;
      }),
        catchError(error => {
          return [];
        })
      )
  }

  getMessages(id, params: HttpParams = null): Observable<any> {
    return this._httpClient.get<any>(`${this._usersUrl}/${id}/messages`, { params })
      .pipe(map((messagesResponse) => {
        return messagesResponse;
      }),
        catchError(error => {
          return [];
        })
      )
  }

  getLastWatchedVideos(id, params: HttpParams = null): Observable<any> {
    return this._httpClient.get<any>(`${this._usersUrl}/${id}/lastWatchedVideos`, { params })
      .pipe(map((messagesResponse) => {
        return messagesResponse.data;
      }),
        catchError(error => {
          return [];
        })
      )
  }

  getVideos(id, params: HttpParams = null): Observable<any> {
    return this._httpClient.get<any>(`${this._usersUrl}/${id}/videos`, { params })
      .pipe(map((userGroupsResponse) => {
        return userGroupsResponse;
      }),
        catchError(error => {
          return [];
        })
      )
  }

  getPokerRooms(id): Observable<any> {
    return this._httpClient.get<any>(`${this._usersUrl}/${id}/pokerrooms?populate=user&populate=pokerRoom`)
      .pipe(map((pokerRoomsResponse) => {
        return pokerRoomsResponse;
      }),
        catchError(error => {
          return [];
        })
      )
  }

  getMoneyRequests(id, skip, limit): Observable<any> {
    return this._httpClient.get<any>(`${this._usersUrl}/${id}/moneyrequests?skip=${skip}&limit=${limit}`)
      .pipe(map((moneyRequestsResponse) => {
        return moneyRequestsResponse;
      }),
        catchError(error => {
          return [];
        })
      )
  }

  getVideosByTerm(id, term: string, queryParams: HttpParams = new HttpParams()): Observable<any[]> {
    queryParams = queryParams.append('term', term)

    return this._httpClient.get<any>(`${this._usersUrl}/${id}/videos`, { params: queryParams })
      .pipe(map((videosResponse) => {
        return videosResponse.data;
      }),
        catchError(error => {
          return [];
        })
      )
  }

  getVideosByCategory(id, categoryId, queryParams: HttpParams = new HttpParams()): Observable<any[]> {
    queryParams = queryParams.append('category[id]', categoryId);

    return this._httpClient.get<any>(`${this._usersUrl}/${id}/videos`, { params: queryParams })
      .pipe(map((videosResponse) => {
        return videosResponse.data;
      }),
        catchError(error => {
          return [];
        })
      )
  }

  getVideosByGroup(id, groupID, queryParams: HttpParams = new HttpParams()): Observable<any[]> {
    queryParams = queryParams.append('group[id]', groupID);

    return this._httpClient.get<any>(`${this._usersUrl}/${id}/videos`, { params: queryParams })
      .pipe(map((videosResponse) => {
        return videosResponse.data;
      }),
        catchError(error => {
          return [];
        })
      )
  }

  activateUser(user: IUser): Observable<any> {
    return this._httpClient.post<any>(`${this._usersUrl}/activate/${user._id}`, {})
      .pipe(map((response) => {
        return {
          status: response.modifiedItems > 0
        };
      }),
        catchError(error => {
          return of({
            status: false,
            error: `Code: ${error.status} - ${error.error.message}`
          });
        })
      );
  }

  deactivateUser(user: IUser): Observable<any> {
    return this._httpClient.post<any>(`${this._usersUrl}/deactivate/${user._id}`, {})
      .pipe(map((response) => {
        return {
          status: response.modifiedItems > 0
        };
      }),
        catchError(error => {
          return of({
            status: false,
            error: `Code: ${error.status} - ${error.error.message}`
          });
        })
      )
  }

  setFavoriteVideo(id, video: IVideo): Observable<any> {
    return this._httpClient.post<any>(`${this._usersUrl}/${id}/videoaction/favorite/${video._id}`, {})
      .pipe(map((response) => {
        return {
          status: response.modifiedItems > 0
        };
      }),
        catchError(error => {
          return of({
            status: false,
            error: `Code: ${error.status} - ${error.error.message}`
          });
        })
      );
  }

  sendVideoStatus(id, video: IVideo, data) {
    return this._httpClient.post<any>(`${this._usersUrl}/${id}/videostatus/${video._id}`,data, {})
      .pipe(map((response) => {
        return {          
          status: response.modifiedItems > 0
        };
      }),
        catchError(error => {
          return of({
            status: false,
            error: `Code: ${error.status} - ${error.error.message}`
          });
        })
      );
  }

  unfavoriteVideo(id, video: IVideo): Observable<any> {
    return this._httpClient.post<any>(`${this._usersUrl}/${id}/videoaction/unfavorite/${video._id}`, {})
      .pipe(map((response) => {
        return {
          status: response.modifiedItems > 0
        };
      }),
        catchError(error => {
          return of({
            status: false,
            error: `Code: ${error.status} - ${error.error.message}`
          });
        })
      );
  }

  getVideoFavoriteStatus(id, video: IVideo): Observable<boolean> {
    return this._httpClient.get<any>(`${this._usersUrl}/${id}/favoritedVideos`, {})
      .pipe(map((response) => {
        const favoritedVideos = response.data.favoritedVideos;
        return _.includes(favoritedVideos, video._id);
      }));
  }

  removeMessage(userId, userMessageId): Observable<boolean> {
    return this._httpClient.delete<any>(`${this._usersUrl}/${userId}/messages/${userMessageId}`, {})
      .pipe(map((response) => {
        return true;
      }));
  }
}
