import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CustomDataSource } from 'app/shared/util/CustomDataSource';
import { IPokerRoom } from './poker-room.model';
import { MatDialogRef, MatTable, MatPaginator } from '@angular/material';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { RolesValidatorService } from 'app/auth/roles-validator.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PokerRoomsService } from './poker-rooms.service';
import { Roles } from 'app/auth/roles';
import { fuseAnimations } from '@fuse/animations';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-poker-rooms',
  templateUrl: './poker-rooms.component.html',
  styleUrls: ['./poker-rooms.component.scss'],
  animations: fuseAnimations
})
export class PokerRoomsComponent implements OnInit, AfterViewInit {
  private _typingTimeout = null;
  private _intialQueryString: string = '?orderBy=name';
  searchTerm: string = '';
  dataSource: CustomDataSource;
  users: IPokerRoom[] = [];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  loading: Boolean;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor(
    private _rolesValidatorService: RolesValidatorService,
    private _translateService: TranslateService,
    private _pokerRoomsService: PokerRoomsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.subscribePaginator();

    //Error at load because the property change after DOM render
    setTimeout(() => {
      this.dataSource = new CustomDataSource(
        this.paginator,
        this._pokerRoomsService,
        this._translateService,
        this._intialQueryString
      );
      this.dataSource.addColumns(['name', 'currency']);
    });
  }

  add() {
    this._rolesValidatorService.validate(Roles.InsertPokerRoom, 'POKER_ROOMS_ERRORS.INSERT_POKER_ROOM.MESSAGE', 'POKER_ROOMS_ERRORS.INSERT_POKER_ROOM.TITLE')
      .subscribe(result => {
        if (!result) return;
        this.table.renderRows();
        this._router.navigate(['/pokerrooms/new']);
      });
  }

  edit(user: IPokerRoom) {
    this._rolesValidatorService.validate(Roles.UpdatePokerRoom, 'POKER_ROOMS_ERRORS.UPDATE_POKER_ROOM.MESSAGE', 'POKER_ROOMS_ERRORS.UPDATE_POKER_ROOM.TITLE')
      .subscribe(result => {
        if (!result) return;
        this._router.navigate([`/pokerrooms/${user._id}`]);
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
            this._router.navigate(['/pokerrooms'], { queryParams: { page: this.paginator.pageIndex } });
          else
            this._router.navigate(['/pokerrooms']);
        })).subscribe();
  }
}
