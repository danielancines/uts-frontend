import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { RolesValidatorService } from './roles-validator.service';

@Injectable()
export class RolesGuardService implements CanActivate {
    constructor(
        private _router: Router,
        private _rolesValidatorService: RolesValidatorService) {
    }

    canActivate(activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!activatedRoute.data || !activatedRoute.data.role) {
            return true;
        }

        return new Observable<boolean>((observer) => {
            this._rolesValidatorService.validate(activatedRoute.data.role, activatedRoute.data.errorMessageKey, activatedRoute.data.errorTitleKey)
                .subscribe(result => {
                    observer.next(result);
                    if (!result) this._router.navigate([this._router.routerState.snapshot.url]);
                    return observer.complete();
                });
        });
    }
}
