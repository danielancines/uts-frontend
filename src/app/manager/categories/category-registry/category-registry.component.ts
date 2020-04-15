import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ICategory } from '../category.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-category-registry',
  templateUrl: './category-registry.component.html',
  styleUrls: ['./category-registry.component.scss']
})
export class CategoryRegistryComponent implements OnInit {
  categoryForm: FormGroup;
  dialogTitle: string = 'Categorias';
  editing: Boolean = false;
  canDelete: Boolean = false;
  
  constructor(
    public _dialogRef: MatDialogRef<CategoryRegistryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICategory,
    private _formBuilder: FormBuilder
  ) { 
    this.categoryForm = this.createCategoryForm();
  }

  ngOnInit() {
    this.editing = this.data._id ? true : false;
  }

  private createCategoryForm(): FormGroup {
    const form = this._formBuilder.group({
      _id: [this.data._id],
      name: [this.data.name, [Validators.required, Validators.minLength(1)]],
      description: [this.data.description, [Validators.required]]
    });

    return form;
  }

}
