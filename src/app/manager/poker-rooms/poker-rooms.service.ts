import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { IService } from 'app/shared/base/IService';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { map, catchError } from 'rxjs/operators';
import { IPokerRoom } from './poker-room.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PokerRoomsService implements IService {
  private _pokerRoomsUrl = `${environment.api_url}/pokerrooms`;

  constructor(private _httpClient: HttpClient) { }

  get(query: string = ''): Observable<{ count: number, data: IPokerRoom[] }> {
    const url = _.isEmpty(query) ? this._pokerRoomsUrl : `${this._pokerRoomsUrl}${query}`;

    return this._httpClient.get<any>(url)
      .pipe(map((pokerRoomsResponse) => {
        return {
          count: pokerRoomsResponse.count,
          data: pokerRoomsResponse.data
        };
      }),
        catchError(error => {
          return [];
        })
      )
  }

  getById(id): Observable<IPokerRoom> {
    return this._httpClient.get<any>(`${this._pokerRoomsUrl}/${id}`)
      .pipe(map((categoryResponse) => {
        return categoryResponse.data;
      }));
  }

  add(pokerRoom: IPokerRoom): Observable<IPokerRoom> {
    return this._httpClient.post<any>(this._pokerRoomsUrl, pokerRoom)
      .pipe(map(pokerRoomResponse => {
        return pokerRoomResponse.data;
      }),
        catchError(error => {
          return [];
        }))
  }

  update(pokerRoom: IPokerRoom): Observable<boolean> {
    return this._httpClient.put<any>(`${this._pokerRoomsUrl}/${pokerRoom._id}`, pokerRoom)
      .pipe(map(response => {
        return true;
      }))
  }

  delete(pokerRoom: IPokerRoom): Observable<boolean> {
    return this._httpClient.delete<any>(`${this._pokerRoomsUrl}/${pokerRoom._id}`);
  }
}
