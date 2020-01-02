import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  private _clientName: string;
  private _apiPort: string;
  
  constructor(
    private _configService: ConfigService
  ) { 
    this.initialize();
  }

  setItem(key: string, value: string){
    localStorage.setItem(`${this._clientName}.${key}`, value);
  }

  getItem(key: string): string{
    return localStorage.getItem(`${this._clientName}.${key}`);
  }

  removeItem(key: string){
    localStorage.removeItem(`${this._clientName}.${key}`);
  }

  private initialize(){
    this._clientName = this._configService.getClientName();
    this._apiPort = this._configService.getApiPort();
  }
}
