import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatProgressBarModule, MatIconModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { LoginComponent } from './login.component';
import { TranslateModule } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuardService } from '../auth/auth-guard.service';

const routes = [
    {
        path: 'auth/login',
        component: LoginComponent
    }
];

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressBarModule,
        MatIconModule,
        TranslateModule,

        FuseSharedModule
    ],
    providers: [        
        CookieService,
        AuthGuardService
    ]
})
export class LoginModule {
}
