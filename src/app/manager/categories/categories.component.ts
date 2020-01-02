import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CustomDataSource } from 'app/shared/util/CustomDataSource';
import { ICategory } from './category.model';
import { MatDialogRef, MatTable, MatPaginator, MatDialog } from '@angular/material';
import { CategoriesService } from './categories.service';
import { RolesValidatorService } from 'app/auth/roles-validator.service';
import { TranslateService } from '@ngx-translate/core';
import { Roles } from 'app/auth/roles';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  animations: fuseAnimations
})
export class CategoriesComponent implements OnInit, AfterViewInit {
  private _typingTimeout = null;
  private _intialQueryString: string = '?orderBy=hierarchy';
  searchTerm: string = '';
  dataSource: CustomDataSource;
  categories: ICategory[] = [];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  loading: Boolean;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _categoriesService: CategoriesService,
    private _rolesValidatorService: RolesValidatorService,
    private _translateService: TranslateService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    //Error at load because the property change after DOM render
    setTimeout(() => {
      this.dataSource = new CustomDataSource(
        this.paginator,
        this._categoriesService,
        this._translateService,
        this._intialQueryString
      );
      this.dataSource.addColumns(['name', 'description']);
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

  add() {
    this._rolesValidatorService.validate(Roles.InsertCategory, 'CATEGORIES_ERRORS.INSERT_CATEGORY.MESSAGE', 'CATEGORIES_ERRORS.INSERT_CATEGORY.TITLE')
      .subscribe(result => {
        if (!result) return;
        this.table.renderRows();
        this._router.navigate(['/categories/new']);
      });
  }

  edit(category: ICategory) {
    this._rolesValidatorService.validate(Roles.UpdateCategory, 'CATEGORIES_ERRORS.UPDATE_CATEGORY.MESSAGE', 'CATEGORIES_ERRORS.UPDATE_CATEGORY.TITLE')
      .subscribe(result => {
        if (!result) return;
        this._router.navigate([`/categories/${category._id}`]);
      });
  }
}
