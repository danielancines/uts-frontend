import { AuthenticationService } from './../../auth/authentication.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EmailService } from 'app/shared/email.service';
import { IEmailData } from 'app/shared/model/IEmailData';
import * as randomWords from 'random-words';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(
    private _emailService: EmailService,
    private _translateService: TranslateService,
    private _authenticationService: AuthenticationService
  ) { }

  resetPassword(userEmail: string): Observable<any> {
    const newPassword = _.join(randomWords(3), '_');
    return new Observable<any>(observer => {
      this._authenticationService.resetPassword(userEmail, newPassword)
        .subscribe(response => {
          if (response.error) {
            observer.error();
          }

          this._translateService.get('RESET_PASSWORD.EMAIL_MESSAGE')
            .subscribe(translation => {
              const emailBody = `<p>${translation.BODY} <strong>${newPassword}</strong></p>`.replace('#1', userEmail);
              const emailData: IEmailData = {
                emailTo: userEmail,
                replyTo: 'ultimateteamsuite@nao-responda.com',
                message: emailBody,
                subject: translation.SUBJECT
              };

              this._emailService.sendEmail(emailData)
                .subscribe(response => {
                  observer.next();
                });
            });
        });
    });
  }
}
