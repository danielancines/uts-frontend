import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IGroup } from '../group.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-group-registry',
  templateUrl: './group-registry.component.html',
  styleUrls: ['./group-registry.component.scss']
})
export class GroupRegistryComponent implements OnInit {
  groupForm: FormGroup;
  dialogTitle: string = 'Groups';
  editing: Boolean = false;
  canDelete: Boolean = false;
  showColorPiker: Boolean = false;
  
  constructor(
    public _dialogRef: MatDialogRef<GroupRegistryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IGroup,
    private _formBuilder: FormBuilder
  ) { 
    this.groupForm = this.createGroupForm();
  }

  ngOnInit() {
    this.editing = this.data._id ? true : false;
  }

  private createGroupForm(): FormGroup {
    const form = this._formBuilder.group({
      _id: [this.data._id],
      name: [this.data.name, [Validators.required, Validators.minLength(1)]],
      description: [this.data.description],
      hierarchy: [this.data.hierarchy, [Validators.required, Validators.pattern("^[0-9]*$")]],
      color: [this.data.color, [Validators.required]]
    });

    return form;
  }

}
