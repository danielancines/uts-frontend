import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IRole } from './role.model';
import { IService } from 'app/shared/base/IService';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class RolesService implements IService {
  private _rolesUrl = `${environment.api_url}/roles`;

  constructor(private _httpClient: HttpClient) { }

  get(queryString: string = ''): Observable<{ count: number, data: any[] }> {
    const url = _.isEmpty(queryString) ? this._rolesUrl : `${this._rolesUrl}${queryString}`;

    return this._httpClient.get<any>(url)
      .pipe(map((rolesResponse) => {
        return { data: rolesResponse.data, count: rolesResponse.count };
      }),
        catchError(error => {
          return [];
        })
      )
  }

  add(role: IRole): Observable<IRole> {
    return this._httpClient.post<any>(this._rolesUrl, role)
      .pipe(map(roleResponse => {
        return roleResponse.data;
      }),
        catchError(error => {
          return [];
        }))
  }
}
