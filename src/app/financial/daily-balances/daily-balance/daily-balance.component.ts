import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-daily-balance',
  templateUrl: './daily-balance.component.html',
  styleUrls: ['./daily-balance.component.scss'],
  animations: fuseAnimations
})
export class DailyBalanceComponent implements OnInit {
  dailyBalanceForm: FormGroup;
  editing: boolean = false;
  dailyBalanceId: string;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private _location: Location,
    private _authenticationService: AuthenticationService,
    private _dateAdapter: DateAdapter<Date>,
    private _activatedRoute: ActivatedRoute,
    private _dailyBalancesService: DailyBalancesService,
    private _rolesValidatorService: RolesValidatorService,
    private _translateService: TranslateService,
    private _dialog: MatDialog,
    private _messageService: MessageService
  ) { }

  ngOnInit() {
    this._dateAdapter.setLocale('pt');
    this.dailyBalanceId = this._activatedRoute.snapshot.paramMap.get('id');
    this.editing = this.dailyBalanceId ? true : false;
    this.createDailyBalanceForm();

    if (this.dailyBalanceId) {
      this.loadDailyBalance();
    }
  }

  back() {
    this._location.back();
  }

  add() {
    this._dailyBalancesService
    .post(this.getDailyBalance())
    .subscribe(response => {
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


  private loadDailyBalance(){
    this._dailyBalancesService
    .getById(this.dailyBalanceId)
    .subscribe(dailyBalance => {
      this.dailyBalanceForm.get('user').patchValue(`${dailyBalance.user.name} ${dailyBalance.user.lastName}`);
      this.dailyBalanceForm.get('firstRegistration').patchValue(dailyBalance.firstRegistration);
      this.dailyBalanceForm.get('lastRegistration').patchValue(dailyBalance.lastRegistration);
      this.dailyBalanceForm.get('quantity').patchValue(dailyBalance.gamesCount);      
      this.dailyBalanceForm.get('date').patchValue(dailyBalance.date);
    });
  }

  private getDailyBalance(): IDailyBalance{    
    return <IDailyBalance>{
      user: { _id: this._authenticationService.user._id },
      date: this.dailyBalanceForm.get('date').value,
      firstRegistration: this.dailyBalanceForm.get('firstRegistration').value,
      lastRegistration: this.dailyBalanceForm.get('lastRegistration').value,
      gamesCount: this.dailyBalanceForm.get('quantity').value
    };
  }

  private createDailyBalanceForm() {
    this.dailyBalanceForm = new FormGroup({
      user: new FormControl(`${this._authenticationService.user.name} ${this._authenticationService.user.lastName}`),
      firstRegistration: new FormControl(),
      lastRegistration: new FormControl(),
      date: new FormControl(new Date()),
      quantity: new FormControl(0, [
        Validators.min(1)
      ])
    });
  }
}
