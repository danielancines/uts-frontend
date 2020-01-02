import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  constructor(
    private _httpClient: HttpClient
  ) { }

  getAddressByZipcode(zipcode): Observable<any> {
    if (_.isEmpty(zipcode)) return;

    return this._httpClient.get<any>(`https://api.postmon.com.br/v1/cep/${zipcode}`)
      .pipe(map(response => {
        return {
          city: response.cidade,
          neighborhood: response.bairro,
          streetName: response.logradouro,
          state: response.estado
        };
      }));
  }
}
