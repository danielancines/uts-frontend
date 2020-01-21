import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatTable, MatPaginator } from '@angular/material';
import { GroupsService } from './groups.service';
import { RolesValidatorService } from 'app/auth/roles-validator.service';
import { TranslateService } from '@ngx-translate/core';
import { IGroup } from './group.model';
import { CustomDataSource } from '../../shared/util/CustomDataSource';
import { Roles } from 'app/auth/roles';
import { fuseAnimations } from '@fuse/animations';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  animations: fuseAnimations
})
export class GroupsComponent implements AfterViewInit, OnInit {
  private _typingTimeout = null;
  private _intialQueryString: string = '?orderBy=hierarchy';
  searchTerm: string = '';
  dataSource: CustomDataSource;
  groups: IGroup[] = [];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  loading: Boolean;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private _groupsService: GroupsService,
    private _rolesValidatorService: RolesValidatorService,
    private _translateService: TranslateService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.subscribePaginator();
    //Error at load because the property change after DOM render
    setTimeout(() => {
      this.dataSource = new CustomDataSource(
        this.paginator,
        this._groupsService,
        this._translateService,
        this._intialQueryString
      );
      this.dataSource.addColumns(['hierarchy', 'name', 'description']);
    });
  }

  add() {
    this._rolesValidatorService.validate(Roles.InsertGroup, 'GROUPS_ERRORS.INSERT_GROUP.MESSAGE', 'GROUPS_ERRORS.INSERT_GROUP.TITLE')
      .subscribe(result => {
        if (!result) return;
        this.table.renderRows();
        this._router.navigate(['/groups/new']);
      });
  }

  edit(group: IGroup) {
    this._rolesValidatorService.validate(Roles.UpdateGroup, 'GROUPS_ERRORS.UPDATE_GROUP.MESSAGE', 'GROUPS_ERRORS.UPDATE_GROUP.TITLE')
      .subscribe(result => {
        if (!result) return;
        this._router.navigate([`/groups/${group._id}`]);
      });
  }

  refresh() {
    this.searchTerm = '';
    this.dataSource.refresh();
  }

  applyFilter(term) {
    this.searchTerm = term;
    clearTimeout(this._typingTimeout);
    this._typingTimeout = setTimeout(() => {
      this.dataSource.refresh([{ key: 'name', value: term }]);
    }, 550);
  }

  private subscribePaginator() {
    this.paginator.pageIndex = parseInt(this._activatedRoute.snapshot.queryParamMap.get('page'));
    this.paginator.page
      .pipe(
        tap(() => {
          if (this.paginator.pageIndex && this.paginator.pageIndex > 0)
            this._router.navigate(['/groups'], { queryParams: { page: this.paginator.pageIndex } });
          else
            this._router.navigate(['/groups']);
        })).subscribe();
  }
}
