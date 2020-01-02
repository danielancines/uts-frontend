import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategory } from './category.model';
import { environment } from 'environments/environment';
import { map, catchError } from 'rxjs/operators';
import { IService } from 'app/shared/base/IService';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService implements IService {
  private _categoryUrl = `${environment.api_url}/categories`;

  constructor(
    private _httpClient: HttpClient
  ) { }

  get(queryString: string = ''): Observable<{ count: number, data: ICategory[] }> {
    const url = _.isEmpty(queryString) ? this._categoryUrl : `${this._categoryUrl}${queryString}`;

    return this._httpClient.get<any>(url)
      .pipe(map((categoriesResponse) => {
        return { data: categoriesResponse.data, count: categoriesResponse.count };
      }),
        catchError(error => {
          return [];
        })
      )
  }

  getById(id): Observable<ICategory> {
    return this._httpClient.get<any>(`${this._categoryUrl}/${id}`)
      .pipe(map((categoryResponse) => {
        return categoryResponse.data;
      }));
  }

  add(category: ICategory): Observable<ICategory> {
    return this._httpClient.post<any>(this._categoryUrl, category)
      .pipe(map(categoryResponse => {
        return categoryResponse.data;
      }),
        catchError(error => {
          return [];
        }))
  }

  update(category: ICategory): Observable<boolean> {
    return this._httpClient.put<any>(`${this._categoryUrl}/${category._id}`, category)
      .pipe(map(response => {
        return true;
      }))
  }

  delete(category: ICategory): Observable<boolean> {
    return this._httpClient.delete<any>(`${this._categoryUrl}/${category._id}`);
  }
}
