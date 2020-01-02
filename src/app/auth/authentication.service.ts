import { Injectable } from '@angular/core';
import { IUser } from '../manager/users/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import * as jwt_decode from 'jwt-decode';
import * as _ from 'lodash';
import { videosNavigation, adminNavigation, financialNavigation, usersNavigation, groupsNavigation, categoriesNavigation, pokerRoomsNavigation, moneyRequestsNavigation, gamesPlayedAndBalanceNavigation, studyNavigation, videosLibrayNavigation } from '../navigation/navigation';
import { Roles } from './roles';
import { LocalstorageService } from 'app/shared/localstorage.service';
import { FuseNavigation } from '@fuse/types';
import { LogService, LogActionType } from 'app/shared/log.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _loginUrl = `${environment.api_url}/auth/login`;
  private _userRolesUrl = `${environment.api_url}/users`;
  private _validatePasswordUrl = `${environment.api_url}/auth/password`;
  private _changePasswordUrl = `${environment.api_url}/auth/changePassword`;
  private _resetPasswordUrl = `${environment.api_url}/auth/resetPassword`;
  private _onMenuChanged = new BehaviorSubject<any>(null);
  private _userRoles: any[];
  menuConfigChanged = this._onMenuChanged.asObservable();

  constructor(
    private _httpClient: HttpClient,
    private _localstorageService: LocalstorageService,
    private _logService: LogService
  ) {
  }

  get user(): IUser {
    return JSON.parse(this._localstorageService.getItem('user'));
  }

  login(email: string, password: string): Observable<IUser> {
    return this._httpClient.post<IUser>(this._loginUrl, { email, password })
      .pipe(map(userResponse => {
        if (userResponse && userResponse.token) {
          this._localstorageService.setItem('user', JSON.stringify(userResponse));
          this._logService.log(LogActionType.Login, this.user);
          this.loadMenu();
        }
        return this.user;
      }));
  }

  validatePassword(password: string): Observable<boolean> {
    return this._httpClient.post<any>(this._validatePasswordUrl, { email: this.user.email, password })
      .pipe(
        map(response => {
          return response.authentication ? response.authentication : false;
        }),
        catchError(error => {
          return of(false);
        }));
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this._httpClient.post<any>(this._changePasswordUrl, { email: this.user.email, currentPassword: currentPassword, newPassword })
      .pipe(
        map(response => {
          return {
            updated: response.updated
          }
        }),
        catchError(error => {
          return of({
            error: error
          });
        }));
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    return this._httpClient.post<any>(this._resetPasswordUrl, { email, newPassword })
      .pipe(
        map(response => {
          return {
            updated: response.updated
          }
        }),
        catchError(error => {
          return of({
            error: error
          });
        }));
  }

  logout(): void {
    if (this.tokenIsValid()) this._logService.log(LogActionType.Logout, this.user);
    this._localstorageService.removeItem('user');
    this._onMenuChanged.next(null);
  }

  loadMenu() {
    if (_.isEmpty(this._userRoles)) {
      this.getUserRoles()
        .pipe(map(roles => roles.map(r => r.role)))
        .subscribe(roles => {
          this.loadMenuItems(roles);
        });
    } else {
      this.loadMenuItems(this._userRoles);
    }
  }

  private loadMenuItems(roles: any[]) {
    this.loadStudyNavigation(roles);
    this.loadFinancialNavigation(roles);
    this.loadAdminNavigation(roles);
  }

  private loadStudyNavigation(roles: any[]) {
    studyNavigation.children = [];
    const navigation = _.clone(studyNavigation);
    this.loadVideosLibraryMenu(navigation);

    if (navigation.children && navigation.children.length > 0)
    this._onMenuChanged.next({ id: 'end', navigation: navigation });
  }

  private loadAdminNavigation(roles: any[]) {
    adminNavigation.children = [];
    const navigation = _.clone(adminNavigation);
    if (_.includes(roles, Roles.SystemAdmin)) {
      this.loadVideosMenu(navigation);
      this.loadUsersMenu(navigation);
      this.loadGroupsMenu(navigation);
      this.loadCategoriesMenu(navigation);
      this.loadPokerRoomsMenu(navigation);
    } else {
      if (_.includes(roles, Roles.AccessVideos)) this.loadVideosMenu(navigation);
      if (_.includes(roles, Roles.AccessUsers)) this.loadUsersMenu(navigation);
      if (_.includes(roles, Roles.AccessGroups)) this.loadGroupsMenu(navigation);
      if (_.includes(roles, Roles.AccessCategories)) this.loadCategoriesMenu(navigation);
      if (_.includes(roles, Roles.AccessPokerRooms)) this.loadPokerRoomsMenu(navigation);
    }

    if (navigation.children && navigation.children.length > 0)
      this._onMenuChanged.next({ id: 'end', navigation: navigation });
  }

  private loadFinancialNavigation(roles: any[]){
    financialNavigation.children = [];
    const financialNavigationClone = _.clone(financialNavigation);

    if (_.includes(roles, Roles.SystemAdmin)) {
      this.loadMoneyRequestsMenu(financialNavigationClone);
      //this.loadGamesAndBalance(financialNavigationClone);
    } else {
      if (_.includes(roles, Roles.AccessMoneyRequests)) this.loadMoneyRequestsMenu(financialNavigationClone);
      //if (_.includes(roles, Roles.AccessGamesAndBalance)) this.loadGamesAndBalance(financialNavigationClone);
    }

    if (financialNavigationClone.children && financialNavigationClone.children.length > 0)
      this._onMenuChanged.next({ id: 'end', navigation: financialNavigationClone });
  }

  private loadVideosLibraryMenu(navigation: FuseNavigation) {
    navigation.children.push(videosLibrayNavigation);
  }

  private loadUsersMenu(navigation: FuseNavigation) {
    navigation.children.push(usersNavigation);
  }

  private loadVideosMenu(navigation: FuseNavigation) {
    navigation.children.push(videosNavigation);
  }

  private loadGroupsMenu(navigation: FuseNavigation) {
    navigation.children.push(groupsNavigation);
  }

  private loadCategoriesMenu(navigation: FuseNavigation) {
    navigation.children.push(categoriesNavigation);
  }

  private loadPokerRoomsMenu(navigation: FuseNavigation) {
    navigation.children.push(pokerRoomsNavigation);
  }

  private loadMoneyRequestsMenu(navigation: FuseNavigation) {
    navigation.children.push(moneyRequestsNavigation);
  }

  private loadGamesAndBalance(navigation: FuseNavigation) {
    navigation.children.push(gamesPlayedAndBalanceNavigation);
  }

  userCanAccess(role: string = ''): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.getUserRoles()
        .pipe(map(roles => roles.map(r => r.role)))
        .subscribe(roles => {
          if (_.includes(roles, Roles.SystemAdmin)) {
            observer.next(true);
            return observer.complete();
          }

          if (_.includes(roles, role)) observer.next(true);
          else observer.next(false);
          return observer.complete();
        });
    });
  }

  isAuthenticated(): boolean {
    if (!this.user || !this.user.token) {
      this.logout();
      return false;
    }

    if (this.tokenIsValid()) {
      return true;
    } else {
      this.logout();
      return false;
    }
  }

  getUserRoles(): Observable<any[]> {
    if (_.isNil(this.user)) {
      return new Observable<any[]>(observer => observer.next([]));
    }

    if (_.isEmpty(this._userRoles)) {
      return this._httpClient.get<any>(`${this._userRolesUrl}/${this.user._id}/roles`)
        .pipe(map(response => {
          return response.data.roles;
        }));
    } else {
      return new Observable<any[]>(observer => observer.next(this._userRoles));
    }
  }

  private tokenIsValid(): boolean {
    if (!this.user) return false;

    const decoded = jwt_decode(this.user.token);
    if (decoded.exp === undefined) return false;

    const date = new Date(0);
    const expirationDate = date.setUTCSeconds(decoded.exp);
    if (expirationDate === undefined) return false;

    return date.valueOf() > new Date().valueOf();
  }

  token(): string {
    if (this.isAuthenticated) {
      return this.user.token;
    } else {
      return '';
    }
  }
}


