import { BehaviorSubject } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { IService } from "../base/IService";
import { TranslateService } from "@ngx-translate/core";
import { tap } from "rxjs/operators";
import { KeyValue } from "@angular/common";
import * as _ from 'lodash';

export class CustomDataSource {
  data = new BehaviorSubject<any[]>([]);
  totalCount: number = 0;
  loadingData: boolean = false;
  displayedColumns: string[];
  private _queryOptions: { key: string, value: string }[] = [];

  constructor(public paginator: MatPaginator, private _service: IService, private _translateService: TranslateService, private _queryString: string, private _contains: boolean = true) {
    this.initializePaginator();
  }

  refresh(queryOptions: KeyValue<string, string>[] = []) {
    this._queryOptions = queryOptions;
    this.paginator.pageIndex = 0;
    this.paginator.page.next();
  }

  addColumns(columns: string[]) {
    this.displayedColumns = columns;
  }

  private initializePaginator() {
    this.paginator.page
      .pipe(
        tap(() => {
          let query: string;
          if (_.isEmpty(this._queryString)) {
            query = `?limit=${this.paginator.pageSize}&page=${this.paginator.pageIndex}`
          } else {
            query = `${this._queryString}&limit=${this.paginator.pageSize}&page=${this.paginator.pageIndex}`;
          }
          _.forEach(this._queryOptions, option => {
            if (this._contains) {
              query = `${query}&${option.key}=~${option.value}`
            } else {
              query = `${query}&${option.key}=${option.value}`
            }
          });
          this.refreshData(query)
        })
      )
      .subscribe();
    this.translatePaginator();
  }

  private refreshData(queryString: string) {
    this.loadingData = true;
    this._service
      .get(queryString)
      .subscribe(response => {
        this.data.next(response.data);
        this.totalCount = response.count;
        this.loadingData = false;
      });
  }

  private translatePaginator() {
    this._translateService.get('GLOBAL.ITEMS_PER_PAGE_LABEL')
      .subscribe(translation => {
        this.paginator._intl.itemsPerPageLabel = translation;
      });
  }
}