import { IPokerRoom } from './../../../manager/poker-rooms/poker-room.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IMoneyRequest } from '../money-request.model';
import { MatDialogRef, MatDialog, DateAdapter } from '@angular/material';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'app/shared/message.service';
import { MoneyRequestsService } from '../money-requests.service';
import localePt from '@angular/common/locales/pt';
import localeEur from '@angular/common/locales/eu';
import { IUser } from 'app/manager/users/user.model';
import { fuseAnimations } from '@fuse/animations';
import * as _ from 'lodash';
import { formatDate, formatNumber, registerLocaleData } from '@angular/common';
import { MessageType } from 'app/shared/messageTypes';
import { ComponentBase } from 'app/shared/base/ComponentBase';

@Component({
  selector: 'app-money-request',
  templateUrl: './money-request.component.html',
  styleUrls: ['./money-request.component.scss'],
  animations: fuseAnimations
})
export class MoneyRequestComponent extends ComponentBase implements OnInit {
  moneyRequest: IMoneyRequest = this.createMoneyRequest();
  moneyRequestId: string;
  moneyRequestForm: FormGroup;
  editing: Boolean = false;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _messageService: MessageService,
    private _activatedRoute: ActivatedRoute,
    private _dateAdapter: DateAdapter<Date>,
    private _moneyRequestsService: MoneyRequestsService
  ) {
    super();
    registerLocaleData(localeEur, 'eur');
    registerLocaleData(localePt, 'pt');
    this._dateAdapter.setLocale('pt');
    this._dateAdapter.setLocale('eur');
  }

  ngOnInit() {
    this.moneyRequestId = this._activatedRoute.snapshot.paramMap.get('id');
    this.editing = this.moneyRequestId ? true : false;
    this.moneyRequestForm = this.createMoneyRequestForm();
    if (this.moneyRequestId) {
      this.loadMoneyRequest();
    }
  }

  save() {
    if (!this.validateForm(this.moneyRequestForm)) {
      this._messageService.showMessage(MessageType.Error, 'MONEY_REQUESTS_MAIN.FORM_INVALID', '');
      return;
    }

    this._moneyRequestsService.update(this.moneyRequestForm.getRawValue())
    .subscribe((response) => {
      this._messageService.showMessage(MessageType.Success, 'MONEY_REQUESTS_MAIN.UPDATE_MESSAGES.SUCCESS', '');
      this._router.navigate(['/moneyrequests']);
    });
  }

  private loadMoneyRequest() {
    this._moneyRequestsService.getById(this.moneyRequestId)
      .subscribe(moneyRequest => {
        this.moneyRequest = moneyRequest;
        this.moneyRequestForm = this.createMoneyRequestForm();
      }, error => {

      })
  }

  private createMoneyRequest(): IMoneyRequest {
    const newMoneyRequest: IMoneyRequest = {
      _id: '',
      user: <IUser>{},
      pokerRoom: <IPokerRoom>{},
      value: 0,
      date: new Date(),
      status: 0,
      details: ''
    };

    return newMoneyRequest;
  }

  private createMoneyRequestForm(): FormGroup {
    const form = this._formBuilder.group({
      _id: [this.moneyRequest._id],
      userName: [this.moneyRequest.user ? this.getPokerRoomUserName() : null],
      userEmail: [this.moneyRequest.pokerRoom ? this.getUserPokerRoomEmail() : null],
      value: [this.moneyRequest.value, [Validators.pattern("\\-?\\d*\\.?\\d{1,2}")]],
      date: [formatDate(this.moneyRequest.date, 'dd/MM/yyyy - HH:mm', 'pt')],
      status: [this.moneyRequest.status.toString()],
      details: [this.moneyRequest.details],
      pokerRoomName: [this.moneyRequest.pokerRoom.name],
      nick: [this.moneyRequest.pokerRoom ? this.getUserPokerRoomNick() : null],
      moreInfo: [this.getPokerRoomMoreInfo()]
    });

    return form;
  }

  private getMoneyRequestValue() {
    const currency = this.getUserPokerRoomCurrency();
    let symbol = 'US$';
    switch (currency) {
      case 'pt': {
        symbol = 'R$';
        break;
      }
      case 'eur': {
        symbol = '€';
        break;
      }
    }

    return formatNumber(this.moneyRequest.value, currency);
  }

  private getPokerRoomMoreInfo() {
    if (this.moneyRequest.user || this.moneyRequest.pokerRoom) {
      const userPokerRoom = _.find(this.moneyRequest.user.pokerRooms, p => p.id === this.moneyRequest.pokerRoom._id);
      if (userPokerRoom) {
        return userPokerRoom.moreInformation;
      } else {
        return '';
      }
    }
    return '';
  }

  private getPokerRoomUserName() {
    if (this.moneyRequest.user || this.moneyRequest.pokerRoom) {
      const userPokerRoom = _.find(this.moneyRequest.user.pokerRooms, p => p.id === this.moneyRequest.pokerRoom._id);
      if (userPokerRoom) {
        return userPokerRoom.fullName;
      } else {
        return '';
      }
    }
    return '';
  }

  private getUserPokerRoomCurrency() {
    if (this.moneyRequest.user || this.moneyRequest.pokerRoom) {
      const userPokerRoom = _.find(this.moneyRequest.user.pokerRooms, p => p.id === this.moneyRequest.pokerRoom._id);
      if (userPokerRoom) {
        return userPokerRoom.currency;
      } else {
        return 'en-US';
      }
    }
    return '';
  }

  private getUserPokerRoomEmail() {
    if (this.moneyRequest.user || this.moneyRequest.pokerRoom) {
      const userPokerRoom = _.find(this.moneyRequest.user.pokerRooms, p => p.id === this.moneyRequest.pokerRoom._id);
      if (userPokerRoom) {
        return userPokerRoom.email;
      } else {
        return '';
      }
    }
    return '';
  }

  private getUserPokerRoomNick() {
    if (this.moneyRequest.user || this.moneyRequest.pokerRoom) {
      const userPokerRoom = _.find(this.moneyRequest.user.pokerRooms, p => p.id === this.moneyRequest.pokerRoom._id);
      if (userPokerRoom) {
        return userPokerRoom.nickName;
      } else {
        return '';
      }
    }
    return '';
  }
}
