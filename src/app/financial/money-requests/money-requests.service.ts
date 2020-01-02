import { Injectable } from '@angular/core';
import { IService } from 'app/shared/base/IService';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { IMoneyRequest } from './money-request.model';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MoneyRequestsService implements IService{
  private _moneyRequestsUrl = `${environment.api_url}/moneyrequests`;

  constructor(private _httpClient: HttpClient) { }

  get(query: string = ''): Observable<{ count: number, data: IMoneyRequest[] }> {
    const url = _.isEmpty(query) ? this._moneyRequestsUrl : `${this._moneyRequestsUrl}${query}`;

    return this._httpClient.get<any>(url)
      .pipe(map((moneyRequestReponse) => {
        return {
          count: moneyRequestReponse.count,
          data: moneyRequestReponse.data
        };
      }),
        catchError(error => {
          return [];
        })
      )
  }

  add(moneyRequest): Observable<IMoneyRequest> {
    return this._httpClient.post<any>(this._moneyRequestsUrl, moneyRequest)
      .pipe(map(moneyRequestReponse => {
        return moneyRequestReponse.data;
      }));
  }

  getById(id): Observable<IMoneyRequest> {
    return this._httpClient.get<any>(`${this._moneyRequestsUrl}/${id}/?populate=user&populate=pokerRoom`)
      .pipe(map((moneyRequestReponse) => {
        return moneyRequestReponse.data;
      }),
        catchError(error => {
          return [];
        })
      )
  }

  update(moneyRequest: IMoneyRequest): Observable<boolean> {
    return this._httpClient.put<any>(`${this._moneyRequestsUrl}/${moneyRequest._id}`, moneyRequest)
      .pipe(map(response => {
        return true;
      }))
  }
}
