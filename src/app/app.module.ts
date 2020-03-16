import { MoneyRequestsModule } from './financial/money-requests/money-requests.module';
import { PokerRoomsModule } from './manager/poker-rooms/poker-rooms.module';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';

import { LoginModule } from './login/login.module';
import { HomeModule } from './home/home.module';
import { VideosLibraryModule } from './videos.library/videos.library.module';
import { VideosModule } from './manager/videos/videos.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecurityInterceptor } from './interceptors/security.interceptor';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ToastrModule } from 'ngx-toastr';
import { UserProfileModule } from './user-profile/user-profile.module';
import { ApiInterceptor } from './interceptors/api.interceptor';
import { UsersModule } from './manager/users/users.module';
import { GroupsModule } from './manager/groups/groups.module';
import { CategoriesModule } from './manager/categories/categories.module';
import { ConfirmDialogModule } from './shared/confirm-dialog/confirm-dialog.module';
import { SharedModule } from './shared/shared.module';
import { ResetPasswordModule } from './login/reset-password/reset-password.module';
import { ForgotPasswordModule } from './login/forgot-password/forgot-password.module';
import { DailyBalancesModule } from './financial/daily-balances/daily-balances.module';
import { HomeShortcutsModule } from './controls/shortcuts/shortcuts.module';

const appRoutes: Routes = [
    {
        path: '**',
        redirectTo: 'auth/login'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule.forRoot(appRoutes),

        ToastrModule.forRoot(),
        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatProgressBarModule,
        ResetPasswordModule,
        ForgotPasswordModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        LoginModule,
        HomeModule,
        VideosLibraryModule,
        VideosModule,
        UsersModule,
        UserProfileModule,
        GroupsModule,
        CategoriesModule,
        ConfirmDialogModule,
        SharedModule,
        PokerRoomsModule,
        MoneyRequestsModule,
        DailyBalancesModule,
        HomeShortcutsModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: SecurityInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiInterceptor,
            multi: true
        },
        { 
            provide: LOCALE_ID, 
            useValue: 'pt' 
        },
        { 
            provide: LOCALE_ID, 
            useValue: 'eur' 
        },
        { 
            provide: LOCALE_ID, 
            useValue: 'en-US' 
        }

    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
