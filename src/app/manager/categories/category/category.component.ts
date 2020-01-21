import { Component, OnInit } from '@angular/core';
import { MessageService } from 'app/shared/message.service';
import { TranslateService } from '@ngx-translate/core';
import { RolesValidatorService } from 'app/auth/roles-validator.service';
import { Roles } from 'app/auth/roles';
import { ICategory } from '../category.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { CategoriesService } from '../categories.service';
import { MessageType } from 'app/shared/messageTypes';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorsHandlerService } from 'app/errors/errors-handler.service';
import { ComponentBase } from 'app/shared/base/ComponentBase';
import { Location } from '@angular/common';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent extends ComponentBase implements OnInit {
  category: ICategory = this.createCategory();
  categoryId: string;
  categoryForm: FormGroup;
  editing: Boolean = false;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _messageService: MessageService,
    private _activatedRoute: ActivatedRoute,
    private _translateService: TranslateService,
    private _categoriesService: CategoriesService,
    private _errorsHandlerService: ErrorsHandlerService,
    private _rolesValidatorService: RolesValidatorService,
    private _location: Location
  ) { 
    super();
  }

  ngOnInit() {
    this.categoryId = this._activatedRoute.snapshot.paramMap.get('id');
    this.editing = this.categoryId ? true : false;
    this.categoryForm = this.createCategoryForm();

    if (this.categoryId) {
      this.loadCategory();
    }
  }

  add() {
    if (!this.validateForm(this.categoryForm)) {
      this._messageService.showMessage(MessageType.Error, 'CATEGORIES_REGISTRY.ERRORS.FORM_INVALID', '');
      return;
    }

    this._categoriesService.add(this.categoryForm.getRawValue())
    .subscribe((newCategory: ICategory) => {
      this._messageService.showMessage(MessageType.Success, 'CATEGORIES_MAIN.INSERT_MESSAGES.SUCCESS', '');
      this.back();
    })
    
  }

  save(){
    if (!this.validateForm(this.categoryForm)) {
      this._messageService.showMessage(MessageType.Error, 'CATEGORIES_REGISTRY.ERRORS.FORM_INVALID', '');
      return;
    }
    
    this._categoriesService.update(this.categoryForm.getRawValue())
    .subscribe((response) => {
      this._messageService.showMessage(MessageType.Success, 'CATEGORIES_MAIN.UPDATE_MESSAGES.SUCCESS', '');
      this.back();
    });
  }

  edit(category: ICategory) {
    this._categoriesService.update(this.categoryForm.getRawValue())
    .subscribe((response) => {
      this._messageService.showMessage(MessageType.Success, 'CATEGORIES_MAIN.UPDATE_MESSAGES.SUCCESS', '');
      this.back();
    });
  }

  delete(category: ICategory) {
    this._rolesValidatorService.validate(Roles.DeleteCategory, 'CATEGORIES_ERRORS.DELETE_CATEGORY.MESSAGE', 'CATEGORIES_ERRORS.DELETE_CATEGORY.TITLE')
      .subscribe(result => {
        if (!result) return;

        this._translateService
          .get('GLOBAL.DELETE_QUESTION_MESSAGE')
          .subscribe(translation => {
            this.confirmDialogRef = this._dialog.open(ConfirmDialogComponent, {
              disableClose: false
            });

            this.confirmDialogRef.componentInstance.confirmMessage = translation.MESSAGE;
            this.confirmDialogRef.componentInstance.title = translation.TITLE;
            this.confirmDialogRef.componentInstance.confirmButtonText = translation.CONFIRM_BUTTON_TEXT;
            this.confirmDialogRef.componentInstance.cancelButtonText = translation.CANCEL_BUTTON_TEXT;

            this.confirmDialogRef.afterClosed().subscribe(result => {
              if (result) {
                this._categoriesService.delete(category)
                  .subscribe((response) => {
                    this._messageService.showMessage(MessageType.Success, 'CATEGORIES_MAIN.DELETE_MESSAGES.SUCCESS', '');
                    this.back();
                  },
                    error => {
                      this._errorsHandlerService.handleError(error);
                    });
              }
              this.confirmDialogRef = null;
            });            
          });
      });
  }

  private back(){
    this._location.back();
  }

  private loadCategory() {
    this._categoriesService.getById(this.categoryId)
      .subscribe(category => {
        this.category = category;
        this.categoryForm = this.createCategoryForm();
      }, error => {

      })
  }

  private createCategory(): ICategory {
    const newCategory: ICategory = {
      _id: '',
      name: '',
      description: ''
    };

    return newCategory;
  }

  private createCategoryForm(): FormGroup {
    const form = this._formBuilder.group({
      _id: [this.category._id],
      name: [this.category.name, [Validators.required, Validators.minLength(1)]],
      description: [this.category.description, [Validators.required]]
    });

    return form;
  }
}
