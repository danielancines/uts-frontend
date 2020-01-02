import { Injector, Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import * as _ from "lodash";
import { ConfigService } from "app/shared/config.service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    private _clientName: string;
    private _apiPort: string;

    constructor(private _injector: Injector) {
        this.initialize();
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = req.url.replace('CLIENT_NAME', this._clientName).replace('PORT', this._apiPort);
        const apiReq = req.clone({ url });
        return next.handle(apiReq);
    }

    private initialize(){
        const configService  = this._injector.get(ConfigService); 
        this._clientName = configService.getClientName();
        this._apiPort = configService.getApiPort();
    }
}