import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _clientName: string;
  private _apiPort: string;
  private _mainLogoPath: string = 'assets/images/logos';

  constructor() {
    this.initialize();
  }

  getClientName() : string{
    return this._clientName;
  }

  getApiPort(): string {
    return this._apiPort;
  }

  getMainLogoPath(): string {
    return `${this._mainLogoPath}/${this._clientName}.png`;
  }

  private initialize(){
    const clientNameMetaItem = _.find(document.getElementsByTagName('meta'), {name: 'clientName'});
    if (!clientNameMetaItem) throw new Error('ClientNameMetaItem not defined');
    const portMetaItem = _.find(document.getElementsByTagName('meta'), {name: 'port'});
    if (!portMetaItem) throw new Error('PortMetaItem not defined');

    this._clientName = clientNameMetaItem.content;
    this._apiPort = portMetaItem.content;
  }
}
