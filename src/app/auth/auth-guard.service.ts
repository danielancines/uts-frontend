import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { MessageService } from 'app/shared/message.service';
import { MessageType } from 'app/shared/messageTypes';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(
        private _router: Router, 
        private _authenticationService: AuthenticationService,
        private _messageService: MessageService){}

    canActivate(activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): boolean {  
        if (this._authenticationService.isAuthenticated()){
            return true;
        }
        
        this._messageService.showMessage(MessageType.Info, 'GLOBAL.ERRORS.401.MESSAGE', '');
        this._router.navigate(['/auth/login', {to: btoa(activatedRoute.routeConfig.path)}]);
        return false;
    }
}
