import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesValidatorService {

  constructor(
    private _authenticationService: AuthenticationService, 
    private _toastrService: ToastrService,
    private _translateService: TranslateService) { }

  validate(role: string, errorMessageKey: string, errorTitleKey: string) : Observable<boolean> {

    return new Observable<boolean>(observer => {
      if (_.isEmpty(role)) {
        this._toastrService.error('Role not provided', 'Validate Roles');
        return observer.next(true);
      }
  
      this._translateService.get([errorMessageKey, errorTitleKey])
      .subscribe(translation => {
        this._authenticationService.userCanAccess(role)
        .subscribe(result => {
          if (result) {
            return observer.next(true);
          } else {
            this._toastrService.error(translation[errorMessageKey], translation[errorTitleKey]);
            return observer.next(false);
          }
        })
      });
    });
  }
}
