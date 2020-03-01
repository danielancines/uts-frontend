import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/auth/authentication.service';
import { DateAdapter } from '@angular/material/core';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';
import { IDailyBalance } from '../daily-balance.model';
import { DailyBalancesService } from '../daily-balances.service';

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

  constructor(
    private _location: Location,
    private _authenticationService: AuthenticationService,
    private _dateAdapter: DateAdapter<Date>,
    private _activatedRoute: ActivatedRoute,
    private _dailyBalancesService: DailyBalancesService
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
    });
  }

  private getDailyBalance(): IDailyBalance{
    return <IDailyBalance>{
      user: { _id: this._authenticationService.user._id },
      date: new Date(),
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
      quantity: new FormControl(0, [
        Validators.min(1)
      ])
    });
  }
}
