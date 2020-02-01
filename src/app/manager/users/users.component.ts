import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IUser } from './user.model';
import { MatDialogRef, MatTable, MatDialog, MatPaginator } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { UsersService } from './users.service';
import { RolesValidatorService } from 'app/auth/roles-validator.service';
import { Roles } from 'app/auth/roles';
import { TranslateService } from '@ngx-translate/core';
import { CustomDataSource } from 'app/shared/util/CustomDataSource';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: fuseAnimations
})
export class UsersComponent implements AfterViewInit, OnInit {
  private _typingTimeout = null;
  private _intialQueryString: string = '?populate=roles&populate=groups';
  searchTerm: string = '';
  dataSource: CustomDataSource;
  users: IUser[] = [];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  loading: Boolean;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private _usersServices: UsersService,
    private _rolesValidatorService: RolesValidatorService,
    private _translateService: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
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
        this._usersServices,
        this._translateService,
        this._intialQueryString
      );
      this.dataSource.addColumns(['email', 'name', 'lastName', 'situation']);
    });
  }

  add() {
    this._rolesValidatorService.validate(Roles.InsertUser, 'USERS_ERRORS.INSERT_USER.MESSAGE', 'USERS_ERRORS.INSERT_USER.TITLE')
      .subscribe(result => {
        if (!result) return;
        this.table.renderRows();
        this._router.navigate(['/users/new']);
      });
  }

  edit(user: IUser) {
    this._rolesValidatorService.validate(Roles.UpdateUser, 'USERS_ERRORS.UPDATE_USER.MESSAGE', 'USERS_ERRORS.UPDATE_USER.TITLE')
      .subscribe(result => {
        if (!result) return;
        this._router.navigate([`/users/${user._id}`]);
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
            this._router.navigate(['/users'], { queryParams: { page: this.paginator.pageIndex } });
          else
            this._router.navigate(['/users']);
        })).subscribe();
  }
}
