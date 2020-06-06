import { Injectable } from '@angular/core';
import { IService } from 'app/shared/base/IService';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { environment } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IDailyBalance } from './daily-balance.model';
import { ErrorsHandlerService } from 'app/errors/errors-handler.service';

@Injectable({
  providedIn: 'root'
})
export class DailyBalancesService implements IService {
  private _gamesAndBalanceUrl = `${environment.api_url}/dailybalances`;

  constructor(private _httpClient: HttpClient,
    private _errorsHandlerService: ErrorsHandlerService) { }

  get(query: string = ''): Observable<{ count: number, data: any[] }> {
    const url = _.isEmpty(query) ? this._gamesAndBalanceUrl : `${this._gamesAndBalanceUrl}${query}`;

    return this._httpClient.get<any>(url)
      .pipe(map((dailyBalancesResponse) => {
        return {
          count: dailyBalancesResponse.count,
          data: dailyBalancesResponse.data
        };
      }),
        catchError(error => {
          return [];
        })
      )
  }

  getById(id): Observable<IDailyBalance> {
    return this._httpClient.get<any>(`${this._gamesAndBalanceUrl}/${id}`)
      .pipe(map((dailyBalancesResponse) => {
        dailyBalancesResponse.data.firstRegistration = new Date(dailyBalancesResponse.data.firstRegistration);
        dailyBalancesResponse.data.lastRegistration = new Date(dailyBalancesResponse.data.lastRegistration);
        dailyBalancesResponse.data.date = new Date(dailyBalancesResponse.data.date);

        return dailyBalancesResponse.data;
      }));
  }

  post(dailyBalance: IDailyBalance): Observable<IDailyBalance> {
    return this._httpClient.post<any>(this._gamesAndBalanceUrl, dailyBalance)
      .pipe(map(dailyBalancesResponse => {
        return dailyBalancesResponse.data;
      }),
        catchError(error => {
          this._errorsHandlerService.handleError(error);
          return [];
        }))
  }

  update(dailyBalance: IDailyBalance): Observable<boolean> {
    return this._httpClient.put<any>(`${this._gamesAndBalanceUrl}/${dailyBalance._id}`, dailyBalance)
      .pipe(map(response => {
        return true;
      }),
      catchError(error => {
        this._errorsHandlerService.handleError(error);
        return [];
      }));
  }

  delete(dailyBalanceId: string): Observable<boolean> {
    return this._httpClient.delete<any>(`${this._gamesAndBalanceUrl}/${dailyBalanceId}`)
      .pipe(map(response => {
        return true;
      }))
  }
}
