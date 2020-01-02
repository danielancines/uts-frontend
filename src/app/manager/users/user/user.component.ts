import { IUserPokerRoom } from './../user-poker-room.model';
import { PokerRoomsService } from './../../poker-rooms/poker-rooms.service';
import { IAddress } from './../address.model';
import { AddressService } from '../../../shared/address.service';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from './../users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { IUser } from '../user.model';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import * as _ from 'lodash';
import { AuthenticationService } from 'app/auth/authentication.service';
import { RolesService } from 'app/manager/roles/roles.service';
import { GroupsService } from 'app/manager/groups/groups.service';
import { IGroup } from 'app/manager/groups/group.model';
import { IRole } from 'app/manager/roles/role.model';
import { MessageType } from 'app/shared/messageTypes';
import { MessageService } from 'app/shared/message.service';
import { RolesValidatorService } from 'app/auth/roles-validator.service';
import { Roles } from 'app/auth/roles';
import { MatDialogRef, MatDialog, MatPaginator } from '@angular/material';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { ResetPasswordService } from 'app/login/reset-password/reset-password.service';
import { CustomDataSource } from 'app/shared/util/CustomDataSource';
import { SelectionModel } from '@angular/cdk/collections';
import { ComponentBase } from 'app/shared/base/ComponentBase';
import { ErrorsHandlerService } from 'app/errors/errors-handler.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: fuseAnimations
})
export class UserComponent extends ComponentBase implements OnInit, AfterViewInit {
  private _typingTimeout = null;
  groupSelection = new SelectionModel<IGroup>(true, []);
  roleSelection = new SelectionModel<IRole>(true, []);
  user: IUser = this.createUser();
  userId: string;
  userForm: FormGroup;
  editing: Boolean = false;
  canDelete: Boolean = false;
  groups: IGroup[] = [];
  roles: IRole[] = [];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  groupsDataSource: CustomDataSource;
  rolesDataSource: CustomDataSource;
  addressNumber: number = 0;
  streetName: string = '';
  zipcode: number = 0;
  city: string = '';
  state: string = '';
  addressComplement: string = '';
  userPokerRoomsDataSource: IUserPokerRoom[] = [];
  pokerRoomsDisplayedColumns: string[] = ['name', 'nickName', 'fullName', 'email', 'moreInformation'];

  @ViewChild('groupsPaginator') groupsPaginator: MatPaginator;
  @ViewChild('rolesPaginator') rolesPaginator: MatPaginator;

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _authenticationService: AuthenticationService,
    private _usersService: UsersService,
    private _rolesService: RolesService,
    private _groupsService: GroupsService,
    private _messageService: MessageService,
    private _rolesValidatorService: RolesValidatorService,
    private _translateService: TranslateService,
    private _resetPasswordService: ResetPasswordService,
    private _addressService: AddressService,
    private _pokerRoomsService: PokerRoomsService,
    private _errorsHandlerService: ErrorsHandlerService
  ) {
    super();
  }

  ngOnInit() {
    this.userId = this._activatedRoute.snapshot.paramMap.get('id');
    this.editing = this.userId ? true : false;
    this.canDelete = !_.isEqual(this.userId, this._authenticationService.user._id);
    this.userForm = this.createUserForm();
    this.updateUserForm();

    if (this.userId) {
      this.loadUser();
    }

    this.listenSelectionForGroups();
    this.listenSelectionForRoles();
  }

  ngAfterViewInit() {
    //Error at load because the property change after DOM render
    setTimeout(() => {
      this.initializeGroupsDataSource();
      this.initializeRolesDataSource();
      this.initializePokerRoomsDataSource();
    });
  }

  createUserForm(): FormGroup {
    // if (this.user.addresses.length <= 0)
    //   this.user.addresses.push(this.createAddress());

    const form = this._formBuilder.group({
      _id: [this.user._id],
      email: [this.user.email, [Validators.required, Validators.email]],
      name: [this.user.name, [Validators.required, Validators.minLength(1)]],
      password: [this.user.password, [Validators.required]],
      active: [this.user.active ? 'true' : 'false'],
      groups: [this.user.groups],
      roles: [this.user.roles],
      lastName: [this.user.lastName, [Validators.required]],
      rg: [this.user.rg, [Validators.required, Validators.pattern("^[0-9]*$")]],
      cpf: [this.user.cpf, [Validators.required, Validators.pattern("^[0-9]*$")]],
      phone: [this.user.phone, [Validators.required]],
      phone1: [this.user.phone1],
      dealPercentage: [this.user.dealPercentage, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.max(100)]],
      addressNumber: [this.addressNumber, [Validators.required, Validators.pattern("^[0-9]*$")]],
      streetName: [this.streetName, [Validators.required]],
      state: [this.state, [Validators.required]],
      city: [this.city, [Validators.required]],
      addressComplement: [this.addressComplement],
      zipcode: [this.zipcode, [Validators.required, Validators.pattern("^[0-9]*$")]],
      canInformValueAtMoneyRequest: [this.user.canInformValueAtMoneyRequest ? 'true' : 'false']
    });

    return form;
  }

  zipcodeChanged(value) {
    this._addressService.getAddressByZipcode(value)
      .subscribe(address => {
        if (!address) return;

        this.userForm.patchValue({
          streetName: address.streetName,
          city: address.city,
          state: address.state
        });
      });
  }

  addUser() {
    if (!this.validateForm(this.userForm)) {
      this._messageService.showMessage(MessageType.Error, 'USERS_REGISTRY.ERRORS.FORM_INVALID', '');
      return;
    }

    this._usersService.add(this.getUserFromForm())
      .subscribe((newUser: IUser) => {
        this._messageService.showMessage(MessageType.Success, 'USERS_MAIN.INSERT_MESSAGES.SUCCESS', '');
        this._router.navigate(['/users']);
      }, errorResponse => {
        if (errorResponse.error.code === 15) {
          this._messageService.showMessage(MessageType.Error, 'USERS_ERRORS.EMAIL_ALREADY_EXISTS.MESSAGE', '');
        }
      });
  }

  saveUser() {
    if (!this.validateForm(this.userForm)) {
      this._messageService.showMessage(MessageType.Error, 'USERS_REGISTRY.ERRORS.FORM_INVALID', '');
      return;
    }

    this._usersService.update(this.getUserFromForm())
      .subscribe((response) => {
        this._messageService.showMessage(MessageType.Success, 'USERS_MAIN.UPDATE_MESSAGES.SUCCESS', '');
        this._router.navigate(['/users']);
      });
  }

  deleteUser(user: IUser) {
    this._rolesValidatorService.validate(Roles.DeleteUser, 'USERS_ERRORS.DELETE_USER.MESSAGE', 'USERS_ERRORS.DELETE_USER.TITLE')
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
                this._usersService.delete(user)
                  .subscribe((response) => {
                    this._messageService.showMessage(MessageType.Success, 'USERS_MAIN.DELETE_MESSAGES.SUCCESS', '');
                    this._router.navigate(['/users']);
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
            this._resetPasswordService.resetPassword(this.user.email)
              .subscribe(result => {
                this._messageService.showMessage(MessageType.Success, translation[resetPasswordMessageKey].FINISHED_RESET, '');
              });
          }
          this.confirmDialogRef = null;
        });
      });
  }

  applyGroupFilter(term) {
    clearTimeout(this._typingTimeout);
    this._typingTimeout = setTimeout(() => {
      this.groupsDataSource.refresh([{ key: 'name', value: term }]);
    }, 550);
  }

  applyAccessFilter(term) {
    clearTimeout(this._typingTimeout);
    this._typingTimeout = setTimeout(() => {
      this.rolesDataSource.refresh([{ key: 'name', value: term }]);
    }, 550);
  }

  private getUserFromForm(): IUser {
    let user = this.userForm.getRawValue();
    if (!user.addresses) {
      user.addresses = [];
    }
    if (!user.pokerRooms) {
      user.pokerRooms = [];
    }

    const userPokerRooms = _.filter(this.userPokerRoomsDataSource, 'nickName');
    _.forEach(userPokerRooms, userPokerRoom => {
      user.pokerRooms.push(userPokerRoom);
    });

    user.addresses.push(
      {
        zipcode: user.zipcode,
        street: user.streetName,
        number: user.addressNumber,
        state: user.state,
        city: user.city,
        complement: user.addressComplement
      } as IAddress);

    delete user.zipcode;
    delete user.streetName;
    delete user.addressNumber;
    delete user.state;
    delete user.city;
    delete user.addressComplement

    return user;
  }

  private initializeGroupsDataSource() {
    this.groupsDataSource = new CustomDataSource(
      this.groupsPaginator,
      this._groupsService,
      this._translateService,
      '?orderBy=name'
    );
    this.groupsDataSource.addColumns(['select', 'name', 'description']);

    this.groupsDataSource.data.subscribe(groups => {
      this.updateSelectedGroups(groups);
    });
  }

  private initializeRolesDataSource() {
    this.rolesDataSource = new CustomDataSource(
      this.rolesPaginator,
      this._rolesService,
      this._translateService,
      '?orderBy=collectionName'
    );

    this.rolesDataSource.addColumns(['select', 'name', 'description']);

    this.rolesDataSource.data.subscribe(roles => {
      this.updateSelectedRoles(roles);
    });
  }

  private initializePokerRoomsDataSource() {
    const data: IUserPokerRoom[] = [];
    this._pokerRoomsService.get('?orderBy=name')
      .subscribe(pokerRoomsReponse => {
        _.forEach(pokerRoomsReponse.data, pokerRoom => {
          let userPokerRommData = this.getUserPokerRoomData(pokerRoom._id, pokerRoom.name, pokerRoom.currency);
          if (userPokerRommData) {
            data.push(userPokerRommData);
          }
        });
        this.userPokerRoomsDataSource = data;
      });
  }

  private getUserPokerRoomData(id, pokerRoomName: string, currency: string): IUserPokerRoom {
    const userPokerData = _.find(this.user.pokerRooms, { 'id': id }) as IUserPokerRoom;
    if (!userPokerData) return <IUserPokerRoom>{ id, name: pokerRoomName, currency };

    return <IUserPokerRoom>{
      name: pokerRoomName,
      fullName: userPokerData.fullName,
      email: userPokerData.email,
      id,
      nickName: userPokerData.nickName,
      currency: userPokerData.currency,
      moreInformation: userPokerData.moreInformation
    };
  }

  private loadUser() {
    this._usersService.getById(this.userId)
      .subscribe(user => {
        this.user = user;
        if (!_.isEmpty(user.addresses)) {
          this.city = user.addresses[0].city;
          this.addressNumber = user.addresses[0].number;
          this.state = user.addresses[0].state;
          this.zipcode = user.addresses[0].zipcode;
          this.streetName = user.addresses[0].street;
          this.addressComplement = user.addresses[0].complement;
        }

        this.userForm = this.createUserForm();
      }, error => {

      })
  }

  private listenSelectionForRoles() {
    this.roleSelection.onChange.subscribe(event => {
      event.added.forEach(role => {
        const selectedRole = _.find(this.user.roles, ['_id', role._id]);
        if (_.isNull(selectedRole) || _.isUndefined(selectedRole)) {
          this.user.roles.push(role);
        }
      });

      event.removed.forEach(role => {
        _.remove(this.user.roles, role);
      });
    });
  }

  private listenSelectionForGroups() {
    this.groupSelection.onChange.subscribe(event => {
      event.added.forEach(group => {
        const selectedGroup = _.find(this.user.groups, ['_id', group._id]);
        if (_.isNull(selectedGroup) || _.isUndefined(selectedGroup)) {
          this.user.groups.push(group);
        }
      });

      event.removed.forEach(group => {
        _.remove(this.user.groups, group);
      });
    });
  }

  private updateSelectedRoles(roles: IRole[]) {
    if (!this.user || !this.user.roles) return;

    _.forEach(this.user.roles, r => {
      const role = _.find(roles, ro => ro._id === r._id);
      if (role) {
        this.roleSelection.select(role);
      }
    });
  }

  private updateSelectedGroups(groups: IGroup[]) {
    if (!this.user || !this.user.groups) return;

    _.forEach(this.user.groups, g => {
      const group = _.find(groups, gr => gr._id === g._id);
      if (group) {
        this.groupSelection.select(group);
      }
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

  private createUser(): IUser {
    const newUser: IUser = {
      _id: '',
      name: '',
      lastName: '',
      email: '',
      password: '',
      avatarHash: '',
      token: '',
      roles: [],
      groups: [],
      active: false,
      phone: '',
      phone1: '',
      cpf: '',
      rg: '',
      dealPercentage: 0,
      addresses: [],
      pokerRooms: [],
      canInformValueAtMoneyRequest: false
    };

    return newUser;
  }
}
