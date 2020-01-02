import { SystemService } from './../shared/system.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as portuguese } from './i18n/pt';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from 'environments/environment';
import { ConfigService } from '../shared/config.service';
import * as _ from 'lodash';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    version: string = environment.version;
    loading = false;
    mainLogo: string;
    alertMessage: {};
    credentialsError: boolean = false;
    userStatusError: boolean = false;
    private _rememberMeOptionValue: boolean;
    private _navigateTo: string;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _router: Router,
        private _cookieService: CookieService,
        private _authenticationService: AuthenticationService,
        private _configService: ConfigService,
        private _activatedRoute: ActivatedRoute,
        private _systemService: SystemService
    ) {
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        this._fuseTranslationLoaderService.loadTranslations(english, portuguese);
    }

    ngOnInit(): void {
        this.loadAlertMessage();
        this.mainLogo = this._configService.getMainLogoPath();
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        if (this._authenticationService.isAuthenticated()) {
            this._router.navigate(['home']);
        }
        this._navigateTo = this._activatedRoute.snapshot.params['to'] || btoa('home');
        this.loadRememberMeOptionValue();
    }

    loadRememberMeOptionValue(): void {
        const cookieValue = this._cookieService.get('rememberMeOptionValue');
        if (cookieValue) {
            this.rememberMeOptionValue = !!cookieValue;
        }

        if (this.rememberMeOptionValue) {
            this.loadUserLoginFromCookie();
        }
    }

    loadUserLoginFromCookie(): void {
        const email = this._cookieService.get('userLogin');
        if (email) {
            this.loginForm.get('email').setValue(email);
        }
    }

    login(): void {
        this.loading = true;
        this.credentialsError = false;
        this.userStatusError = false;
        const email: string = this.loginForm.get('email').value;
        this._authenticationService.login(email, this.loginForm.get('password').value)
            .subscribe(
                (response) => {
                    this.loading = false;
                    this._router.navigate([atob(this._navigateTo)]);
                    this._cookieService.set('userLogin', email);
                },
                (error) => {
                    if (error.error.code == 14) {
                        this.credentialsError = true;
                    } else if (error.error.code == 20) {
                        this.userStatusError = true;
                    }

                    this.loading = false;
                    this.loginForm.get('password').patchValue(null);
                }
            );
    }

    set rememberMeOptionValue(value: boolean) {
        if (!value) {
            this._cookieService.delete('rememberMeOptionValue');
            this._cookieService.delete('userLogin');
        } else {
            this._cookieService.set('rememberMeOptionValue', String(value));
        }

        this._rememberMeOptionValue = value;
    }

    get rememberMeOptionValue(): boolean {
        return this._rememberMeOptionValue;
    }

    private loadAlertMessage() {

        this._systemService.getSystemMessages()
        .subscribe(
            messages => {
                if (!_.isNull(messages) && messages.length > 0) {
                    this.alertMessage = {
                        title: messages[0].title,
                        message: messages[0].message,
                        timeMessage: messages[0].message1
                    }
                }
            },
            error => {

            }
        );
    }
}
