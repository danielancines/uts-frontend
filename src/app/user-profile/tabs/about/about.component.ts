import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl, Validator, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import * as _ from 'lodash';
import { __setInputValues } from '@angularclass/hmr';
import { AuthenticationService } from 'app/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Themes } from 'app/fuse-config/themes';
import { FuseConfigService } from '@fuse/services/config.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'profile-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ProfileAboutComponent implements OnInit, OnDestroy {
    about: any;
    changePasswordForm: FormGroup;
    hasDifferentPasswords: boolean = false;
    passwordDontMatch: boolean = false
    themes: any[] = [];
    selectedTheme: any;

    private _passwordUpdatedKey: string = 'USER_PROFILE.MESSAGES.PASSWORD_UPDATED';
    private _passwordUpdatedErrorKey: string = 'USER_PROFILE.MESSAGES.PASSWORD_UPDATE_ERROR';
    private _passwordNotUpdatedKey: string = 'USER_PROFILE.MESSAGES.PASSWORD_NOT_UPDATED';

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ProfileService} _profileService
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _authenticationService: AuthenticationService,
        private _toastrService: ToastrService,
        private _translateService: TranslateService,
        private _fuseConfigService: FuseConfigService,
        private _cookieService: CookieService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.changePasswordForm = this.createChangePasswordForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loadThemesOptions();
        this.initializeSelectedTheme();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    createChangePasswordForm(): FormGroup {
        return this._formBuilder.group({
            currentPassword: ['', [Validators.required]],
            newPassword: ['', [Validators.required]],
            confirmNewPassword: ['', [Validators.required, EqualPasswordsValidator('newPassword')]]
        });
    }

    save() {
        this.passwordDontMatch = false;
        const currentPasswordControl = this.changePasswordForm.get('currentPassword');
        const newPasswordControle = this.changePasswordForm.get('newPassword');

        this._authenticationService.validatePassword(currentPasswordControl.value)
            .subscribe(response => {
                if (!response) {
                    return this.passwordDontMatch = true;
                }

                this.changePassword(currentPasswordControl.value, newPasswordControle.value);
            });
    }

    onThemeSelectionChanged(theme){
        this._cookieService.set('theme', theme);
        this._fuseConfigService.config = { colorTheme: theme };
    }

    private changePassword(currentPassword: string, newPassword: string) {
        this._translateService.get([this._passwordUpdatedKey, this._passwordUpdatedErrorKey, this._passwordNotUpdatedKey])
            .subscribe(translation => {
                this._authenticationService.changePassword(currentPassword, newPassword)
                    .subscribe(response => {
                        if (response.error) {
                            this._toastrService.error(translation[this._passwordUpdatedErrorKey]);
                        } else {
                            if (response.updated) {

                                this._toastrService.success(translation[this._passwordUpdatedKey]);
                                this.changePasswordForm.reset();
                            } else {
                                this._toastrService.error(translation[this._passwordNotUpdatedKey]);
                            }
                        }
                    });
            });
    }

    private loadThemesOptions() {
        for (let key in Themes) {
            this.themes.push({key: key, value: Themes[key]});
        }
    }

    private initializeSelectedTheme() {
        if (this._cookieService.check('theme')){
            this.selectedTheme = this._cookieService.get('theme');
        } else {
            this.selectedTheme = Themes.defaultTheme;
        }

        this._fuseConfigService.config = { colorTheme: this.selectedTheme };
    }
}

export function EqualPasswordsValidator(compareTo: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!control || !control.parent) {
            return null;
        }

        const compareToControl = control.parent.get(compareTo);
        if (!compareToControl) {
            return null;
        }

        if (!_.isNull(compareToControl) && !_.isEqual(compareToControl.value, control.value)) {
            return { 'passwordsDoesntMatch': true };
        }

        return null;
    }
}