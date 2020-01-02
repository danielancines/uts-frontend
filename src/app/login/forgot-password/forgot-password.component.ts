import { ConfigService } from 'app/shared/config.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ResetPasswordService } from '../reset-password/reset-password.service';
import { MessageService } from 'app/shared/message.service';
import { MessageType } from 'app/shared/messageTypes';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ForgotPasswordComponent implements OnInit {
    forgotPasswordForm: FormGroup;
    mainLogo: string;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _configService: ConfigService,
        private _resetPassword: ResetPasswordService,
        private _messageService: MessageService,
        private _translateService: TranslateService
    ) {
        // Configure the layout
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
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.mainLogo = this._configService.getMainLogoPath();
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    sendEmail() {
        this._translateService.get('FORGOT_PASSWORD')
        .subscribe(translation => {
            this._resetPassword.resetPassword(this.forgotPasswordForm.getRawValue().email)
            .subscribe(result => {
                this._messageService.showMessage(MessageType.Success, translation.PASSWORD_RESET_SUCCESS, '');
            }, error => {
                this._messageService.showMessage(MessageType.Error, translation.PASSWORD_RESET_ERROR, '');
            });
        });
    }
}
