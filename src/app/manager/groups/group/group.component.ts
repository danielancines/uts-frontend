import { RolesValidatorService } from './../../../auth/roles-validator.service';
import { Component, OnInit } from '@angular/core';
import { IGroup } from '../group.model';
import { fuseAnimations } from '@fuse/animations';
import { GroupsService } from '../groups.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'app/shared/message.service';
import { MessageType } from 'app/shared/messageTypes';
import { Roles } from 'app/auth/roles';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { ComponentBase } from 'app/shared/base/ComponentBase';
import { ErrorsHandlerService } from 'app/errors/errors-handler.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  animations: fuseAnimations
})
export class GroupComponent extends ComponentBase implements OnInit {
  group: IGroup = this.createGroup();
  groupId: string;
  groupForm: FormGroup;
  editing: Boolean = false;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _groupsService: GroupsService,
    private _activatedRoute: ActivatedRoute,
    private _messageService: MessageService,
    private _translateService: TranslateService,
    private _errorsHandlerService: ErrorsHandlerService,
    private _rolesValidatorService: RolesValidatorService,
    private _location: Location
  ) { 
    super();
  }

  ngOnInit() {
    this.groupId = this._activatedRoute.snapshot.paramMap.get('id');
    this.editing = this.groupId ? true : false;
    this.groupForm = this.createGroupForm();

    if (this.groupId) {
      this.loadGroup();
    }
  }

  addGroup() {
    if (!this.validateForm(this.groupForm)) {
      this._messageService.showMessage(MessageType.Error, 'GROUPS_REGISTRY.ERRORS.FORM_INVALID', '');
      return;
    }

    this._groupsService.add(this.groupForm.getRawValue())
      .subscribe((newGroup: IGroup) => {
        this._messageService.showMessage(MessageType.Success, 'GROUPS_MAIN.INSERT_MESSAGES.SUCCESS', '');
        this.back();
      });
  }

  saveGroup(){
    if (!this.validateForm(this.groupForm)) {
      this._messageService.showMessage(MessageType.Error, 'GROUPS_REGISTRY.ERRORS.FORM_INVALID', '');
      return;
    }
    
    this._groupsService.update(this.groupForm.getRawValue())
    .subscribe((response) => {
      this._messageService.showMessage(MessageType.Success, 'GROUPS_MAIN.UPDATE_MESSAGES.SUCCESS', '');
      this.back();
    });
  }

  deleteGroup(group: IGroup) {
    this._rolesValidatorService.validate(Roles.DeleteGroup, 'GROUPS_ERRORS.DELETE_GROUP.MESSAGE', 'GROUPS_ERRORS.DELETE_GROUP.TITLE')
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
                this._groupsService.delete(group)
                  .subscribe((response) => {
                    this._messageService.showMessage(MessageType.Success, 'GROUPS_MAIN.DELETE_MESSAGES.SUCCESS', '');
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

  back(){
    this._location.back();
  }

  private loadGroup() {
    this._groupsService.getById(this.groupId)
      .subscribe(group => {
        this.group = group;
        this.groupForm = this.createGroupForm();
      }, error => {

      })
  }

  private createGroupForm(): FormGroup {
    const form = this._formBuilder.group({
      _id: [this.group._id],
      name: [this.group.name, [Validators.required]],
      description: [this.group.description, [Validators.required]],
      hierarchy: [this.group.hierarchy, [Validators.required, Validators.pattern("^[0-9]*$")]],
      color: [this.group.color]
    });

    return form;
  }

  private createGroup(): IGroup {
    const newGroup: IGroup = {
      _id: '',
      name: '',
      description: '',
      color: '',
      hierarchy: 0
    };

    return newGroup;
  }
}
