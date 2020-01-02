import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MessageType } from './messageTypes';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private _translateService: TranslateService,
    private _toastrService: ToastrService
  ) {

  }

  showMessage(type: MessageType, messageKey: string, titleKey: string) {
    this._translateService.get([messageKey, titleKey])
      .subscribe(translation => {
        switch (type) {
          case MessageType.Error:
              this._toastrService.error(translation[messageKey], translation[titleKey]);  
            break;
          case MessageType.Success:
            this._toastrService.success(translation[messageKey], translation[titleKey]);
            break;
          case MessageType.Warning:
            this._toastrService.warning(translation[messageKey], translation[titleKey]);
            break;
          case MessageType.Info:
            this._toastrService.info(translation[messageKey], translation[titleKey]);
            break;
          default:
            this._toastrService.show(translation[messageKey], translation[titleKey]);
            break;
        }
      });
  }
}
