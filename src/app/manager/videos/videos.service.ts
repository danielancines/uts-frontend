import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IVideo } from './video.model';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as _ from 'lodash';
import { IService } from 'app/shared/base/IService';

@Injectable({
  providedIn: 'root'
})
export class VideosService implements IService {
  private _videosUrl = `${environment.api_url}/videos`;

  constructor(private _httpClient: HttpClient) { }

  videos(): Observable<IVideo[]> {
    return this._httpClient.get<any>(this._videosUrl)
      .pipe(map((videosResponse) => {
        return videosResponse.data;
      }),
        catchError(error => {
          return [];
        })
      )
  }

  get(query: string = ''): Observable<{ count: number, data: IVideo[] }> {
    const url = _.isEmpty(query) ? this._videosUrl : `${this._videosUrl}${query}`;
    return this._httpClient.get<any>(url)
      .pipe(map((videosResponse) => {
        return {
          count: videosResponse.count,
          data: videosResponse.data
        }

      }),
        catchError(error => {
          return [];
        })
      )
  }

  getById(id): Observable<IVideo> {
    return this._httpClient.get<any>(`${this._videosUrl}/${id}`)
      .pipe(map((videoResponse) => {
        return videoResponse.data;
      }));
  }

  getToWatchById(id): Observable<IVideo> {
    return this._httpClient.get<any>(`${this._videosUrl}/watch/${id}`)
      .pipe(map((videoResponse) => {
        return videoResponse.data;
      }));
  }

  getByCategory(id): Observable<IVideo[]> {
    const params = new HttpParams()
      .set('category[id]', id);

    return this._httpClient.get<any>(this._videosUrl, { params: params })
      .pipe(map((videosResponse) => {
        return videosResponse.data;
      }),
        catchError(error => {
          return [];
        })
      )
  }

  getByTerm(term): Observable<IVideo[]> {
    const params = new HttpParams()
      .set('name', term);
    return this._httpClient.get<any>(this._videosUrl, { params: params })
      .pipe(map((videosResponse) => {
        return videosResponse.data;
      }),
        catchError(error => {
          return [];
        })
      )
  }

  add(video: IVideo): Observable<IVideo> {
    return this._httpClient.post<any>(this._videosUrl, video)
      .pipe(map(videosResponse => {
        return videosResponse.data;
      }),
        catchError(error => {
          return [];
        }))
  }

  update(video: IVideo): Observable<boolean> {
    return this._httpClient.put<any>(`${this._videosUrl}/${video._id}`, video)
      .pipe(map(response => {
        return true;
      }))
  }

  delete(video: IVideo): Observable<boolean> {
    return this._httpClient.delete<any>(`${this._videosUrl}/${video._id}`)
      .pipe(map(response => {
        return true;
      }))
  }
}
