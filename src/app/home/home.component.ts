import { MessageService } from 'app/shared/message.service';
import { MoneyRequestsService } from './../financial/money-requests/money-requests.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/authentication.service';
import { IUser } from 'app/manager/users/user.model';
import { fuseAnimations } from '@fuse/animations';
import { UsersService } from 'app/manager/users/users.service';
import { registerLocaleData } from '@angular/common';
import * as _ from 'lodash';
import { IUserPokerRoom } from 'app/manager/users/user-poker-room.model';
import localePt from '@angular/common/locales/pt';
import { MatPaginator } from '@angular/material/paginator';
import { DateAdapter } from '@angular/material/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageType } from 'app/shared/messageTypes';
import { Roles } from 'app/auth/roles';
import { RolesValidatorService } from 'app/auth/roles-validator.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: fuseAnimations
})
export class HomeComponent implements OnInit {
  user: IUser;
  widgets: any[];
  totalVideos: number = 0;
  totalUserVideos: number = 0;
  toWatchVideos: number = 0;
  teamMembers: IUser[] = [];
  teamMemberGridColumns = ['avatar', 'name', 'group', 'email'];
  moneyRequestsDisplayedColumns = ['date', 'pokerRoom', 'value', 'situation'];
  pokerRooms: IUserPokerRoom[] = [];
  moneyRequestsDataSource: { data: any[], length: number } = { data: [], length: 0 };
  moneyRequestForm: FormGroup;
  canInformValueAtMoneyRequest: boolean;
  userMessages: any[] = [];
  lastWatchedVideos: any[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private _dateAdapter: DateAdapter<Date>,
    private _messageService: MessageService,
    private _router: Router,
    private _cookieService: CookieService,
    private _moneyRequestsService: MoneyRequestsService,
    private _authenticationService: AuthenticationService,
    private _rolesValidatorService: RolesValidatorService
  ) {
    registerLocaleData(localePt, 'pt');
    this._dateAdapter.setLocale('pt');
  }

  ngOnInit(): void {
    this.user = this._authenticationService.user;
    this.initializeMoneyRequestFormControl();
    this.loadVideosCount();
    this.loadTeamMembers();
    this.loadPokerRooms();
    this.loadMoneyRequests();
    this.loadUserMessages();
    this.loadLastWatchedVideos();

    if (!this._cookieService.check('FUSE2.shortcuts')) {
      this._cookieService.set('FUSE2.shortcuts', JSON.stringify([{
        title: 'Videos',
        type: 'videos',
        icon: 'movie',
        url: '/videoslibrary'
      }]));
    }

    this.paginator.page.subscribe(page => {
      this.loadMoneyRequests(this.paginator.pageIndex, this.paginator.pageSize);
    });
  }

  deleteMessage(userMessage: any) {
    this._usersService.removeMessage(this._authenticationService.user._id, userMessage._id)
      .subscribe(result => {
        this.loadUserMessages();
      });
  }

  getTeamMemberGroupName(teamMember: IUser): string {
    const lastGroup = _.chain(teamMember.groups)
      .orderBy(['hierarchy'], ['desc'])
      .last()
      .value();

    return lastGroup ? lastGroup.name : 'Não encontrado';
  }

  sendMoneyRequest() {
    this._rolesValidatorService.validate(Roles.InsertMoneyRequest, 'HOME.FINANCIAL_TAB.MONEY_REQUESTS_TAB.ERRORS.USER_CANNOT_SEND_MONEY_REQUEST', '')
      .subscribe(result => {
        if (!result) return;
        const userMoneyRequest = this.moneyRequestForm.getRawValue();
        const moneyRequest = {
          pokerRoom: userMoneyRequest.pokerRoom.id,
          user: this.user._id,
          value: userMoneyRequest.value ? userMoneyRequest.value.replace(',', '.') : 0,
          date: userMoneyRequest.date
        };

        this._moneyRequestsService.add(moneyRequest)
          .subscribe(response => {
            this._messageService.showMessage(MessageType.Success, 'HOME.FINANCIAL_TAB.MONEY_REQUESTS_TAB.MESSAGES.MONEY_REQUEST_SENT_OK', '');
            this.initializeMoneyRequestFormControl();
            this.loadMoneyRequests();
          }, error => {
            this._messageService.showMessage(MessageType.Error, 'HOME.FINANCIAL_TAB.MONEY_REQUESTS_TAB.MESSAGES.ERRORS.MONEY_REQUEST_SENT_ERROR', '');
          });
      });
  }

  displayPokerRoomName(pokerRoom?: IUserPokerRoom): string | undefined {
    return pokerRoom ? pokerRoom.name : undefined;
  }

  startVideo(videoInfo: any): void {
    this._router.navigate([`watchvideo/${videoInfo._id}`]);
  }

  private loadLastWatchedVideos() {
    this.lastWatchedVideos = [];
    this._usersService.getLastWatchedVideos(this._authenticationService.user._id)
      .subscribe(videos => {
        _.forEach(videos, v => {
          this.lastWatchedVideos.push({
            _id: v.videoInfo._id,
            title: v.videoInfo.name,
            currentTime: v.videoInfo.currentTime
          });
        });
      });
  }
  private loadUserMessages() {
    this._usersService.getMessages(this._authenticationService.user._id)
      .subscribe(response => {
        this.userMessages = response.data;
      });
  }

  private loadTeamMembers() {
    this._usersService.get('?populate=groups&active=true')
      .subscribe(response => {
        this.teamMembers = response.data;
      });
  }

  private loadVideosCount() {
    const params = new HttpParams()
    .set('summarized', 'true');

    this._usersService.getVideos(this._authenticationService.user._id, params)
      .subscribe(response => {
        this.totalVideos = response.data.length;
        this.totalUserVideos = response.data.filter(d => d.canWatch).length;
        this.toWatchVideos = this.totalUserVideos - response.totalWatchedVideos;
      });
  }

  private loadPokerRooms() {
    this._usersService.getPokerRooms(this._authenticationService.user._id)
      .subscribe(response => {
        _.forEach(response.data, pokerRoom => {
          this.pokerRooms.push(<IUserPokerRoom>{
            id: pokerRoom.id,
            name: pokerRoom.name,
            currency: pokerRoom.currency,
            balance: 0
          })
        });
      });
  }

  private loadMoneyRequests(skip: number = 0, limit: number = 10) {
    this._usersService.getMoneyRequests(this._authenticationService.user._id, skip * limit, limit)
      .subscribe(response => {
        this.moneyRequestsDataSource.data = response.data;
        this.moneyRequestsDataSource.length = response.count;
      });
  }

  private initializeMoneyRequestFormControl() {
    this._usersService.getById(this.user._id)
      .subscribe(user => {
        this.canInformValueAtMoneyRequest = user.canInformValueAtMoneyRequest;
      });

    this.moneyRequestForm = this._formBuilder.group({
      date: [new Date()],
      value: [],
      pokerRoom: []
    });
  }
}
