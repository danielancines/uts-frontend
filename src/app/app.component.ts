import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { navigation } from './navigation/navigation';
import { locale as navigationEnglish } from './navigation/i18n/en';
import { locale as navigationPortuguese } from './navigation/i18n/pt';
import { locale as videosPortuguese } from './manager/videos/i18n/pt';
import { locale as videosEnglish } from './manager/videos/i18n/en';
import { locale as homePortuguese } from './home/i18n/pt';
import { locale as homeEnglish } from './home/i18n/en';
import { locale as globalPortuguese } from './i18n/pt';
import { locale as globalEnglish } from './i18n/en';
import { locale as groupsPortuguese } from './manager/groups/i18n/pt';
import { locale as groupsEnglish } from './manager/groups/i18n/en';
import { locale as usersPortuguese } from './manager/users/i18n/pt';
import { locale as usersEnglish } from './manager/users/i18n/en';
import { locale as categoriesPortuguese } from './manager/categories/i18n/pt';
import { locale as categoriesEnglish } from './manager/categories/i18n/en';
import { locale as pokerRoomsPortuguese } from './manager/poker-rooms/i18n/pt';
import { locale as pokerRoomsEnglish } from './manager/poker-rooms/i18n/en';
import { locale as resetPasswordPortuguese } from './login/reset-password/i18n/pt';
import { locale as resetPasswordEnglish } from './login/reset-password/i18n/en';
import { locale as forgotPasswordPortuguese } from './login/forgot-password/i18n/pt';
import { locale as forgotPasswordEnglish } from './login/forgot-password/i18n/en';
import { locale as moneyRequestsPortuguese } from './financial/money-requests/i18n/pt';
import { locale as moneyRequestsEnglish } from './financial/money-requests/i18n/en';
import { locale as gamesAndBalancePortuguese } from './financial/games-and-balance/i18n/pt';
import { locale as gamesAndBalanceEnglish } from './financial/games-and-balance/i18n/en';

import { AuthenticationService } from './auth/authentication.service';
import { CookieService } from 'ngx-cookie-service';
import * as _ from 'lodash';
import { Themes } from './fuse-config/themes';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform,
        private _authenticationService: AuthenticationService,
        private _cookieService: CookieService
    ) {
        this.navigation = _.clone(navigation);

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

        this._authenticationService.menuConfigChanged
            .subscribe(item => {
                if (item) {
                    this._fuseNavigationService.addNavigationItem(item.navigation, item.id);
                    // Translation error, fix to update language for new items
                    this._fuseNavigationService.setCurrentNavigation('main');
                } else {
                    this.navigation = _.clone(navigation);
                    this._fuseNavigationService.unregister('main');
                    this._fuseNavigationService.register('main', this.navigation);
                    this._fuseNavigationService.setCurrentNavigation('main');
                }
            });

        // Add languages
        this._translateService.addLangs(['en', 'pt']);

        // Set the default language
        this._translateService.setDefaultLang('en');

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(
            navigationEnglish, navigationPortuguese,
            videosEnglish, videosPortuguese,
            homeEnglish, homePortuguese,
            globalEnglish, globalPortuguese,
            groupsEnglish, groupsPortuguese,
            usersEnglish, usersPortuguese,
            categoriesEnglish, categoriesPortuguese,
            pokerRoomsEnglish, pokerRoomsPortuguese,
            resetPasswordPortuguese, resetPasswordEnglish,
            forgotPasswordPortuguese, forgotPasswordEnglish,
            moneyRequestsPortuguese, moneyRequestsEnglish,
            gamesAndBalancePortuguese, gamesAndBalanceEnglish);

        // Use a language
        this._translateService.use('pt');
        /**
         * ------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ------------------------------------------------------------------
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         **/

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        //  setTimeout(() => {
        //     this._translateService.setDefaultLang('en');
        //     this._translateService.setDefaultLang('pt');
        //  });

        /**
         * ------------------------------------------------------------------
         * ngxTranslate Fix End
         * ------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.intializeTheme();
        // Subscribe to config changes
        this._authenticationService.loadMenu();
        this._fuseNavigationService.onNavigationChanged
            .subscribe(result => {
                // ngxTranslate Fix Start
                setTimeout(() => {
                    if (this._cookieService.check('language')) {
                        const language = JSON.parse(this._cookieService.get('language'));
                        this._translateService.setDefaultLang('en');
                        this._translateService.setDefaultLang(language.id);
                    } else {
                        this._translateService.setDefaultLang('en');
                        this._translateService.setDefaultLang('pt');
                    }
                });
                // ngxTranslate Fix End
            });
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
                if (this.fuseConfig.layout.width === 'boxed') {
                    this.document.body.classList.add('boxed');
                }
                else {
                    this.document.body.classList.remove('boxed');
                }
                // Color theme - Use normal for loop for IE11 compatibility
                for (let i = 0; i < this.document.body.classList.length; i++) {
                    const className = this.document.body.classList[i];

                    if (className.startsWith('theme-')) {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    intializeTheme(): void {
        if (this._cookieService.check('theme')) {
            this._fuseConfigService.config = { colorTheme: this._cookieService.get('theme') };
        } else {
            this._fuseConfigService.config = Themes.defaultTheme;
        }
    }
}
