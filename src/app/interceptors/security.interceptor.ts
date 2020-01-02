import { Injector, Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthenticationService } from '../auth/authentication.service';
import { Router } from "@angular/router";
import { MessageType } from "app/shared/messageTypes";
import { MessageService } from "app/shared/message.service";
import * as _ from 'lodash';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
    constructor(private _injector: Injector) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authenticationService = this._injector.get(AuthenticationService);

        if (req.url.indexOf('api.postmon.com.br') > 0){
            return next.handle(req);
        }

        if (authenticationService.isAuthenticated()) {
            const headers = new HttpHeaders({
                'x-access-token': authenticationService.token(),
                'Content-Type': 'application/json'
            });

            const authRequest = req.clone({ headers });
            return next.handle(authRequest);
        } else {
            if (req.url.indexOf('auth/login') > 0 || req.url.indexOf('system/alertMessages') > 0 || req.url.indexOf('auth/resetPassword') > 0 || req.url.indexOf('v1/emails') > 0) {
                return next.handle(req);
            } else {
                const router = this._injector.get(Router);
                const messageService = this._injector.get(MessageService);

                messageService.showMessage(MessageType.Info, 'GLOBAL.ERRORS.401.MESSAGE', '');
                router.navigate(['auth/login']);
                return next.handle(req);
            }
        }
    }
}