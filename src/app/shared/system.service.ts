import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private _systemMessagesUrl = `${environment.api_url}/system/alertMessages`;

  constructor(
    private _httpClient: HttpClient
  ) { }

  getSystemMessages(): Observable<any> {
    return this._httpClient.get<any>(this._systemMessagesUrl)
    .pipe(
      map(response => {
        return response.data;
      }),
      catchError(error => {
        return of({
          error: error
        });
      }));

  }
}
