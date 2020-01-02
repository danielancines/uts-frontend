import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEmailData } from './model/IEmailData';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private _emailsUrl = `${environment.api_url}/emails`;

  constructor(
    private _httpClient: HttpClient
  ) { }

  sendEmail(data: IEmailData): Observable<any>{
    return this._httpClient.post(this._emailsUrl, data)
    .pipe(
      map(response => {
        return {
          emailSent: true
        }
      }),
      catchError(error => {
        return of({
          error: error
        });
      }));
  }

  sendEmailToAllActiveUsers(data: IEmailData): Observable<any>{
    return this._httpClient.post(`${this._emailsUrl}/allusers`, data)
    .pipe(
      map(response => {
        return {
          emailSent: true
        }
      }),
      catchError(error => {
        return of({
          error: error
        });
      }));
  }
}
