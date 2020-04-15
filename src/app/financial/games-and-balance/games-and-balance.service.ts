import { Injectable } from '@angular/core';
import { IService } from 'app/shared/base/IService';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { environment } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GamesAndBalanceService implements IService {
  private _gamesAndBalanceUrl = `${environment.api_url}/gamesandbalance`;

  constructor(private _httpClient: HttpClient) { }

  get(query: string = ''): Observable<{ count: number, data: any[] }> {
    const url = _.isEmpty(query) ? this._gamesAndBalanceUrl : `${this._gamesAndBalanceUrl}${query}`;

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
}
