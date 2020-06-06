import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/auth/authentication.service';
import { DateAdapter } from '@angular/material/core';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';
import { IDailyBalance } from '../daily-balance.model';
import { DailyBalancesService } from '../daily-balances.service';
import { RolesValidatorService } from 'app/auth/roles-validator.service';
import { Roles } from 'app/auth/roles';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { MessageService } from 'app/shared/message.service';
import { MessageType } from 'app/shared/messageTypes';
import { ComponentBase } from 'app/shared/base/ComponentBase';
import { IUserPokerRoom } from 'app/manager/users/user-poker-room.model';
import { PokerRoomsService } from 'app/manager/poker-rooms/poker-rooms.service';
import * as _ from 'lodash';
import { disableDebugTools } from '@angular/platform-browser';
import { UsersService } from 'app/manager/users/users.service';

@Component({
  selector: 'app-daily-balance',
  templateUrl: './daily-balance.component.html',
  styleUrls: ['./daily-balance.component.scss'],
  animations: fuseAnimations
})
export class DailyBalanceComponent extends ComponentBase implements OnInit {
  dailyBalanceForm: FormGroup;
  editing: boolean = false;
  dailyBalanceId: string;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  userPokerRoomsDataSource: IUserPokerRoom[] = [];
  dailyBalance: IDailyBalance;
  pokerRoomsDisplayedColumns: string[] = ['name', 'nickName', 'fullName', 'email', 'balance'];

  constructor(
    private _location: Location,
    private _authenticationService: AuthenticationService,
    private _dateAdapter: DateAdapter<Date>,
    private _activatedRoute: ActivatedRoute,
    private _dailyBalancesService: DailyBalancesService,
    private _rolesValidatorService: RolesValidatorService,
    private _translateService: TranslateService,
    private _dialog: MatDialog,
    private _messageService: MessageService,
    private _pokerRoomsService: PokerRoomsService,
    private _userService: UsersService
  ) { super() }

  ngOnInit() {
    this._dateAdapter.setLocale('pt');
    this.dailyBalanceId = this._activatedRoute.snapshot.paramMap.get('id');
    this.editing = this.dailyBalanceId ? true : false;
    this.createDailyBalanceForm();

    if (this.dailyBalanceId) {
      this.loadDailyBalance();
    } else {
      this.initializePokerRoomsDataSource();
    }
  }

  back() {
    this._location.back();
  }

  add() {
    if (!this.validateForm(this.dailyBalanceForm)) {
      this._messageService.showMessage(MessageType.Error, 'DAILY_BALANCES_REGISTRY.FORM_INVALID', '');
      return;
    }

    this._dailyBalancesService
      .post(this.getDailyBalance())
      .subscribe(response => {
        this._location.back();
      });
  }

  save() {
    if (!this.validateForm(this.dailyBalanceForm)) {
      this._messageService.showMessage(MessageType.Error, 'DAILY_BALANCES_REGISTRY.FORM_INVALID', '');
      return;
    }

    var dailyBalance = this.getDailyBalance();
    dailyBalance._id = this.dailyBalanceId;
    this._dailyBalancesService.update(dailyBalance)
      .subscribe((response) => {
        this._messageService.showMessage(MessageType.Success, 'DAILY_BALANCES_REGISTRY.UPDATE_MESSAGES.SUCCESS', '');
        this._location.back();
      });
  }

  delete() {
    this._rolesValidatorService.validate(Roles.DeleteDailyBalances, 'DAILY_BALANCES_REGISTRY.ERRORS.DELETE_DAILY_BALANCE.MESSAGE', 'DAILY_BALANCES_REGISTRY.ERRORS.DELETE_DAILY_BALANCE.TITLE')
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
                this._dailyBalancesService.delete(this.dailyBalanceId)
                  .subscribe((response) => {
                    this._messageService.showMessage(MessageType.Success, 'DAILY_BALANCES_REGISTRY.DELETE_MESSAGES.SUCCESS', '');
                    this.back();
                  }, error => {
                    alert(error);
                  });
              }
              this.confirmDialogRef = null;
            });
          });
      });
  }


  private loadDailyBalance() {
    this._dailyBalancesService
      .getById(this.dailyBalanceId)
      .subscribe(dailyBalance => {
        this.dailyBalance = dailyBalance;
        this.dailyBalanceForm.get('user').patchValue(`${dailyBalance.user.name} ${dailyBalance.user.lastName}`);
        this.dailyBalanceForm.get('firstRegistration').patchValue(dailyBalance.firstRegistration);
        this.dailyBalanceForm.get('lastRegistration').patchValue(dailyBalance.lastRegistration);
        this.dailyBalanceForm.get('quantity').patchValue(dailyBalance.gamesCount);
        this.dailyBalanceForm.get('date').patchValue(dailyBalance.date);

        this.initializePokerRoomsDataSource();
      });
  }

  private getDailyBalance(): IDailyBalance {
    return <IDailyBalance>{
      user: { _id: this._authenticationService.user._id },
      date: this.dailyBalanceForm.get('date').value,
      firstRegistration: this.dailyBalanceForm.get('firstRegistration').value,
      lastRegistration: this.dailyBalanceForm.get('lastRegistration').value,
      gamesCount: this.dailyBalanceForm.get('quantity').value,
      balances: this.getBalances()
    };
  }

  private createDailyBalanceForm() {
    this.dailyBalanceForm = new FormGroup({
      user: new FormControl(`${this._authenticationService.user.name} ${this._authenticationService.user.lastName}`),
      firstRegistration: new FormControl(null, [Validators.required]),
      lastRegistration: new FormControl(null, [Validators.required]),
      date: new FormControl(new Date()),
      quantity: new FormControl(0, [
        Validators.min(1)
      ])
    });
  }

  private initializePokerRoomsDataSource() {
    const data: IUserPokerRoom[] = [];
    this._userService.getPokerRooms(this._authenticationService.user._id)
      .subscribe(userResponse => {
        _.forEach(userResponse, pokerRoom => {
          let userPokerRommData = this.getUserPokerRoomData(pokerRoom);
          if (userPokerRommData) {
            data.push(userPokerRommData);
          };
        });

        this.userPokerRoomsDataSource = data;
      });
  }

  private getUserPokerRoomData(pokerRoom: IUserPokerRoom): IUserPokerRoom {
    if (this.dailyBalance){
      const userPokerData = _.find(this.dailyBalance.user.pokerRooms, { 'id': pokerRoom.id }) as IUserPokerRoom;
      if (!userPokerData) return null;
  
      var balance = 0;
      if (this.dailyBalance) {
        var balanceItem = _.find(this.dailyBalance.balances, { 'pokerRoomId': pokerRoom.id }) as any;
        if (balanceItem) {
          balance = balanceItem.value;
        }
      }
    }

    return <IUserPokerRoom>{
      name: pokerRoom.name,
      fullName: pokerRoom.fullName,
      email: pokerRoom.email,
      id: pokerRoom.id,
      nickName: pokerRoom.nickName,
      currency: pokerRoom.currency,
      balance: balance
    };
  }

  private getBalances(): any {
    var balances = [];
    _.forEach(this.userPokerRoomsDataSource, userBalance => {
      balances.push({
        pokerRoomId: userBalance.id,
        value: userBalance.balance
      });
    });

    return balances;
  }
}
