import { Component, OnInit, ViewChild } from '@angular/core';
import { RolesValidatorService } from 'app/auth/roles-validator.service';
import { Roles } from 'app/auth/roles';
import { Router } from '@angular/router';
import { MatPaginator, MatTable } from '@angular/material';
import { CustomDataSource } from 'app/shared/util/CustomDataSource';
import { GamesAndBalanceService } from './games-and-balance.service';
import { TranslateService } from '@ngx-translate/core';
import { IFilterGroup } from 'app/controls/filter/model/group.model';
import { IFilterOption } from 'app/controls/filter/model/option.model';
import { fuseAnimations } from '@fuse/animations';
import * as _ from 'lodash';

@Component({
  selector: 'app-games-and-balance',
  templateUrl: './games-and-balance.component.html',
  styleUrls: ['./games-and-balance.component.scss'],
  animations: fuseAnimations
})
export class GamesAndBalanceComponent implements OnInit {
  dataSource: CustomDataSource;
  searchTerm: string = '';
  filterGroups: IFilterGroup[] = [];
  selectedFilterOptions: IFilterOption[];

  private _intialQueryString: string = '?populate=user&populate=pokerRoom&orderBy=date desc';
  
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _router: Router,
    private _translateService: TranslateService,
    private _rolesValidatorService: RolesValidatorService,
    private _gamesAndBalanceService: GamesAndBalanceService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    //Error at load because the property change after DOM render
    setTimeout(() => {
      this.dataSource = new CustomDataSource(
        this.paginator,
        this._gamesAndBalanceService,
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

  add() {
    this._rolesValidatorService.validate(Roles.InsertGamesAndBalance, 'GAMES_AND_BALANCE.ERRORS.INSERT_GAME_BALANCE.MESSAGE', 'GAMES_AND_BALANCE.ERRORS.INSERT_GAME_BALANCE.TITLE')
      .subscribe(result => {
        if (!result) return;
        console.log(result);
        this.table.renderRows();
        this._router.navigate(['/gamesandbalance/new']);
      });
  }

  refresh() {
    this.searchTerm = '';
    // if (this.selectedFilterOptions && this.selectedFilterOptions.length > 0) {
    //   this.refreshDataSourceWithFilters();
    // } else {
    //   this.dataSource.refresh();
    // }
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
