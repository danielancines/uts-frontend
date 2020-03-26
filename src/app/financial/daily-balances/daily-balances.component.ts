import { Component, OnInit, ViewChild } from '@angular/core';
import { RolesValidatorService } from 'app/auth/roles-validator.service';
import { Roles } from 'app/auth/roles';
import { Router } from '@angular/router';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CustomDataSource } from 'app/shared/util/CustomDataSource';
import { DailyBalancesService } from './daily-balances.service';
import { TranslateService } from '@ngx-translate/core';
import { IFilterGroup } from 'app/controls/filter/model/group.model';
import { IFilterOption } from 'app/controls/filter/model/option.model';
import { fuseAnimations } from '@fuse/animations';
import * as _ from 'lodash';
import { IDailyBalance } from './daily-balance.model';
import { AuthenticationService } from 'app/auth/authentication.service';

@Component({
  selector: 'app-daily-balances',
  templateUrl: './daily-balances.component.html',
  styleUrls: ['./daily-balances.component.scss'],
  animations: fuseAnimations
})
export class DailyBalancesComponent implements OnInit {
  dataSource: CustomDataSource;
  searchTerm: string = '';
  filterGroups: IFilterGroup[] = [];
  selectedFilterOptions: IFilterOption[];

  private _intialQueryString: string;
  
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _translateService: TranslateService,
    private _rolesValidatorService: RolesValidatorService,
    private _dailyBalancesService: DailyBalancesService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._intialQueryString = `?user=${this._authenticationService.user._id}&populate=user&populate=pokerRoom&orderBy=date desc`;
    //Error at load because the property change after DOM render
    setTimeout(() => {
      this.dataSource = new CustomDataSource(
        this.paginator,
        this._dailyBalancesService,
        this._translateService,
        this._intialQueryString,
        false
      );
      this.dataSource.addColumns(['date', 'userName', 'gamesCount', 'firstRegistration', 'lastRegistration']);
      this.dataSource.refresh();

      const subscription = this.dataSource.data.subscribe(data => {
        if(!subscription) return;

        subscription.unsubscribe();
        this.refresh();
      });
    });
  }

  add() {
    this._rolesValidatorService.validate(Roles.InsertDailyBalances, 'DAILY_BALANCES.ERRORS.INSERT_DAILY_BALANCE.MESSAGE', 'DAILY_BALANCES.ERRORS.INSERT_DAILY_BALANCE.TITLE')
      .subscribe(result => {
        if (!result) return;
        this.table.renderRows();
        this._router.navigate(['/dailybalances/new']);
      });
  }

  edit(dailyBalance: IDailyBalance) {
    this._rolesValidatorService.validate(Roles.UpdateDailyBalances, 'DAILY_BALANCES.UPDATE_DAILY_BALANCE.MESSAGE', 'DAILY_BALANCES.UPDATE_DAILY_BALANCE.TITLE')
      .subscribe(result => {
        if (!result) return;
        this._router.navigate([`/dailybalances/${dailyBalance._id}`]);
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

  private refreshDataSourceWithFilters() {
    let refreshOptions: any[] = [];
    _.forEach(this.selectedFilterOptions, option => {
      if (option.isSelected)
        refreshOptions.push({ key: 'status', value: option.query.value });
    })
    this.dataSource.refresh(refreshOptions);
  }

}
