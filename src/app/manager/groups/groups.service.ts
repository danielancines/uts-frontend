import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGroup } from './group.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';
import { IService } from 'app/shared/base/IService';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class GroupsService implements IService {
  private _groupsUrl = `${environment.api_url}/groups`;

  constructor(
    private _httpClient: HttpClient
  ) { }

  get(queryString: string = ''): Observable<{ count: number, data: IGroup[] }> {
    const url = _.isEmpty(queryString) ? this._groupsUrl : `${this._groupsUrl}${queryString}`;

    return this._httpClient.get<any>(url)
      .pipe(map((groupsResponse) => {
        return { data: groupsResponse.data, count: groupsResponse.count };
      }),
        catchError(error => {
          return [];
        })
      )
  }

  getById(id): Observable<IGroup> {
    return this._httpClient.get<any>(`${this._groupsUrl}/${id}`)
      .pipe(map((groupResponse) => {
        return groupResponse.data;
      }));
  }

  add(group: IGroup): Observable<IGroup> {
    return this._httpClient.post<any>(this._groupsUrl, group)
      .pipe(map(groupResponse => {
        return groupResponse.data;
      }),
        catchError(error => {
          return [];
        }))
  }

  update(group: IGroup): Observable<boolean> {
    return this._httpClient.put<any>(`${this._groupsUrl}/${group._id}`, group)
      .pipe(map(response => {
        return true;
      }))
  }

  delete(group: IGroup): Observable<boolean> {
    return this._httpClient.delete<any>(`${this._groupsUrl}/${group._id}`);
  }
}
