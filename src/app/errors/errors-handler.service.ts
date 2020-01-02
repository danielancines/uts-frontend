import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'app/shared/message.service';
import { MessageType } from 'app/shared/messageTypes';
import { AuthenticationService } from 'app/auth/authentication.service';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class ErrorsHandlerService {
    constructor(
        private _messageService: MessageService,
        private _authanticationService: AuthenticationService,
        private _router: Router
    ) {

    }

    handleError(responseError: Error | HttpErrorResponse) {
        if (responseError instanceof HttpErrorResponse) {
            if (responseError.error.code) {
                this.handleErrorByCode(responseError);
            }
        } else {
            this._messageService.showMessage(MessageType.Error, 'GLOBAL.ERRORS.500.MESSAGE', 'GLOBAL.ERRORS.500.TITLE');
        }
    }

    private handleErrorByCode(responseError: HttpErrorResponse) {
        switch (responseError.error.code) {
            case 201:
                this._messageService.showMessage(MessageType.Error, 'GLOBAL.ERRORS.201.MESSAGE', 'GLOBAL.ERRORS.201.TITLE');
                break;
            case 202:
                this._messageService.showMessage(MessageType.Error, 'GLOBAL.ERRORS.202.MESSAGE', 'GLOBAL.ERRORS.202.TITLE');
                break;
            case 400:
                this._messageService.showMessage(MessageType.Error, 'GLOBAL.ERRORS.400.MESSAGE', 'GLOBAL.ERRORS.400.TITLE');
                break;
            case 401:
                this._messageService.showMessage(MessageType.Error, 'GLOBAL.ERRORS.401.MESSAGE', '');
                this._authanticationService.logout();
                this._router.navigate(['auth/login']);
                break;
            default:
                this._messageService.showMessage(MessageType.Error, responseError.error.message, 'GLOBAL.ERRORS.500.TITLE');
                break;
        }
    }
}