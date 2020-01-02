import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatTable, MatPaginator, DateAdapter } from '@angular/material';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { IMoneyRequest } from './money-request.model';
import { MoneyRequestsService } from './money-requests.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomDataSource } from 'app/shared/util/CustomDataSource';
import { fuseAnimations } from '@fuse/animations';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { IFilterGroup } from 'app/controls/filter/model/group.model';
import { IFilterOption } from 'app/controls/filter/model/option.model';
import * as _ from 'lodash';
import { RolesValidatorService } from 'app/auth/roles-validator.service';
import { Roles } from 'app/auth/roles';
import { Router } from '@angular/router';

@Component({
  selector: 'app-money-requests',
  templateUrl: './money-requests.component.html',
  styleUrls: ['./money-requests.component.scss'],
  animations: fuseAnimations
})
export class MoneyRequestsComponent implements OnInit {
  private _typingTimeout = null;
  private _intialQueryString: string = '?populate=user&populate=pokerRoom&orderBy=date desc';
  private MONEY_REQUEST_FILTER_OPTIONS = 'moneyRequestsFilterOptions';
  searchTerm: string = '';
  dataSource: CustomDataSource;
  moneyRequests: IMoneyRequest[] = [];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  loading: Boolean;
  filterGroups: IFilterGroup[] = [];
  selectedFilterOptions: IFilterOption[];
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _moneyRequestsService: MoneyRequestsService,
    private _translateService: TranslateService,
    private _dateAdapter: DateAdapter<Date>,
    private _cookieService: CookieService,
    private _rolesValidatorService: RolesValidatorService,
    private _router: Router
  ) {
    registerLocaleData(localePt, 'pt');
    this._dateAdapter.setLocale('pt');
  }

  ngOnInit() {
    this.loadFilterGroups();
    this.loadSavedFilters();
  }

  ngAfterViewInit() {
    //Error at load because the property change after DOM render
    setTimeout(() => {
      this.dataSource = new CustomDataSource(
        this.paginator,
        this._moneyRequestsService,
        this._translateService,
        this._intialQueryString,
        false
      );
      this.dataSource.addColumns(['date', 'userName', 'pokerRoomName', 'value', 'status']);

      const subscription = this.dataSource.data.subscribe(data => {
        if(!subscription) return;

        subscription.unsubscribe();
        this.refresh();
      });
    });
  }

  edit(moneyRequest: IMoneyRequest) {
    this._rolesValidatorService.validate(Roles.UpdateMoneyRequest, 'MONEY_REQUESTS_ERRORS.UPDATE_MONEY_REQUESTS.MESSAGE', 'MONEY_REQUESTS_ERRORS.UPDATE_MONEY_REQUESTS.TITLE')
      .subscribe(result => {
        if (!result) return;
        this._router.navigate([`/moneyrequests/${moneyRequest._id}`]);
      });
  }

  refresh() {
    this.searchTerm = '';
    if (this.selectedFilterOptions && this.selectedFilterOptions.length > 0) {
      this.refreshDataSourceWithFilters();
    } else {
      this.dataSource.refresh();
    }
  }

  applyFilter(term) {
    this.searchTerm = term;
    clearTimeout(this._typingTimeout);
    this._typingTimeout = setTimeout(() => {
      this.dataSource.refresh([{ key: 'name', value: term }]);
    }, 550);
  }

  optionSelected(selectedOptions: IFilterOption[]): void {
    this.searchTerm = '';
    this.selectedFilterOptions = selectedOptions;
    this._cookieService.set(this.MONEY_REQUEST_FILTER_OPTIONS, JSON.stringify(selectedOptions));
    this.refreshDataSourceWithFilters();
  }

  private loadSavedFilters() {
    if (this._cookieService.check(this.MONEY_REQUEST_FILTER_OPTIONS)){
      this.selectedFilterOptions = <IFilterOption[]>JSON.parse(this._cookieService.get(this.MONEY_REQUEST_FILTER_OPTIONS));
    }
  }

  private refreshDataSourceWithFilters() {
    let refreshOptions: any[] = [];
    _.forEach(this.selectedFilterOptions, option => {
      if (option.isSelected)
        refreshOptions.push({ key: 'status', value: option.query.value });
    })
    this.dataSource.refresh(refreshOptions);
  }

  private loadFilterGroups(): void {
    this._translateService.get('MONEY_REQUESTS_MAIN.FILTER_OPTIONS')
      .subscribe(translation => {
        this.filterGroups.push(
          <IFilterGroup>{
            name: translation.LIST.TITLE,
            options: [
              <IFilterOption>{
                name: translation.LIST.APPROVED,
                query: {
                  operation: 'approved',
                  value: '2'
                }
              },
              <IFilterOption>{
                name: translation.LIST.WAITING,
                query: {
                  operation: 'waiting',
                  value: '0'
                }
              },
              <IFilterOption>{
                name: translation.LIST.REFUSED,
                query: {
                  operation: 'refused',
                  value: '1'
                }
              }
            ]
          });
      });
  }
}
