import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/auth/authentication.service';
import { IUser } from 'app/manager/users/user.model';
import { locale as userProfilePortuguese } from './i18n/pt';
import { locale as userProfileEnglish } from './i18n/en';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  animations: fuseAnimations
})
export class UserProfileComponent implements OnInit {
  user: IUser;
  
  
  constructor(
    private _authenticationService: AuthenticationService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService
  ) {
    this.user = this._authenticationService.user;
    this._fuseTranslationLoaderService.loadTranslations(userProfileEnglish, userProfilePortuguese);
   }

  ngOnInit() {
  }


}
