import { IEmailData } from 'app/shared/model/IEmailData';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IUser } from '../user.model';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { GroupsService } from 'app/manager/groups/groups.service';
import { IGroup } from 'app/manager/groups/group.model';
import * as _ from 'lodash';
import { RolesService } from 'app/manager/roles/roles.service';
import { IRole } from 'app/manager/roles/role.model';
import { AuthenticationService } from 'app/auth/authentication.service';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { MessageService } from 'app/shared/message.service';
import { MessageType } from 'app/shared/messageTypes';
import { ResetPasswordService } from 'app/login/reset-password/reset-password.service';

@Component({
  selector: 'app-user-registry',
  templateUrl: './user-registry.component.html',
  styleUrls: ['./user-registry.component.scss']
})
export class UserRegistryComponent implements OnInit {
  userForm: FormGroup;
  dialogTitle: string = 'Users';
  groups: IGroup[] = [];
  roles: IRole[] = [];
  editing: Boolean = false;
  canDelete: Boolean = false;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    public _dialogRef: MatDialogRef<UserRegistryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUser,
    private _formBuilder: FormBuilder,
    private _rolesService: RolesService,
    private _groupsService: GroupsService,
    private _authenticationService: AuthenticationService,
    private _translateService: TranslateService,
    private _dialog: MatDialog,
    private _messageService: MessageService,
    private _resetPassword: ResetPasswordService
  ) {
    this.userForm = this.createUserForm();
  }

  ngOnInit() {
    this.editing = this.data._id ? true : false;
    this.canDelete = !_.isEqual(this.data._id, this._authenticationService.user._id);

    this.updateUserForm();

    this._groupsService.get()
      .subscribe(
        response => {
          this.groups = response.data;
          this.updateSelectedGroups();
        }
      );

    // this._rolesService.get()
    //   .subscribe(roles => {
    //     this.roles = roles;
    //     this.updateSelectedRoles();
    //   });
  }

  updateSelectedRoles() {
    if (!this.data || !this.data.roles) return;
    const selectedRoles: IRole[] = [];

    _.forEach(this.data.roles, r => {
      const role = _.find(this.roles, ro => ro._id === r._id);
      if (role) {
        selectedRoles.push(role);
      }
    });

    if (selectedRoles.length > 0) {
      this.userForm.patchValue(
        {
          roles: selectedRoles
        }
      )
    }
  }

  updateSelectedGroups() {
    if (!this.data || !this.data.groups) return;
    const selectedGroups: IGroup[] = [];

    _.forEach(this.data.groups, g => {
      const group = _.find(this.groups, gr => gr._id === g._id);
      if (group) {
        selectedGroups.push(group);
      }
    });

    if (selectedGroups.length > 0) {
      this.userForm.patchValue(
        {
          groups: selectedGroups
        }
      )
    }
  }

  createUserForm(): FormGroup {
    const form = this._formBuilder.group({
      _id: [this.data._id],
      email: [this.data.email, [Validators.required, Validators.email]],
      name: [this.data.name, [Validators.required, Validators.minLength(1)]],
      password: [this.data.password, [Validators.required]],
      groups: [this.data.groups],
      roles: [this.data.roles],
      lastName: [this.data.lastName, [Validators.required]],
    });

    return form;
  }

  resetPassword() {
    const resetPasswordMessageKey = 'USERS_MAIN.UPDATE_MESSAGES.RESET_PASSWORD';
    const changingPasswordMessageKey = 'USERS_MAIN.UPDATE_MESSAGES.CHANGING_PASSWORD';
    this._translateService
      .get([resetPasswordMessageKey, changingPasswordMessageKey])
      .subscribe(translation => {
        this.confirmDialogRef = this._dialog.open(ConfirmDialogComponent, {
          disableClose: false
        });
        
        this.confirmDialogRef.componentInstance.confirmMessage = translation[resetPasswordMessageKey].MESSAGE;
        this.confirmDialogRef.componentInstance.title = translation[resetPasswordMessageKey].TITLE;
        this.confirmDialogRef.componentInstance.confirmButtonText = translation[resetPasswordMessageKey].CONFIRM_BUTTON_TEXT;
        this.confirmDialogRef.componentInstance.cancelButtonText = translation[resetPasswordMessageKey].CANCEL_BUTTON_TEXT;

        this.confirmDialogRef.afterClosed().subscribe(result => {
          if (result) {
            this._messageService.showMessage(MessageType.Info, translation[changingPasswordMessageKey], '');
            this._resetPassword.resetPassword(this.data.email)
              .subscribe(result => {
                this._messageService.showMessage(MessageType.Success, translation[resetPasswordMessageKey].FINISHED_RESET, '');
              });
          }
          this.confirmDialogRef = null;
        });
      });
  }

  private updateUserForm() {
    if (this.editing) {
      const passwordControl = this.userForm.get('password');
      if (passwordControl) {
        passwordControl.clearValidators();
        passwordControl.updateValueAndValidity();
      }
    }
  }
}
