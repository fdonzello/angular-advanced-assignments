import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, DepositRequest, BaseRequest } from 'src/app/reducers';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DepositRequestAction } from 'src/app/reducers/deposit-request-reducer';
import { WithdrawRequestAction } from 'src/app/reducers/withdraw-request-reducer';
import { map, filter } from 'rxjs/operators'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  balance$: Observable<number>;
  depositRequest$: Observable<DepositRequest>;
  depositRequestSubscription: Subscription;
  operationInProgress = false;
  error: string | null;

  form: FormGroup;
  depositOperationChoice = 'deposit';
  withdrawOperationChoice = 'withdraw';

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    // no need to unsubscribe. async pipe will unsubscribe itself
    // automatically.
    this.balance$ = this.store.select('balance');

    combineLatest(
      this.store.select('depositRequest'),
      this.store.select('withdrawRequest')
    )
      .pipe(

        // we're not interested in unkown operations
        filter(values => {
          return values[0].status !== 'unknown' || values[1].status !== 'unknown';
        }),

        // selecting which of two observables is providing informations
        map(values => {
          if (values[0].status === 'unknown') {
            return values[1];
          }

          return values[0];
        })

      )
      .subscribe((r: BaseRequest) => {

        this.operationInProgress = r.status === 'in_progress';

        if (r.status === 'failed') {
          this.error = r.failureReason;
        } else {
          this.error = null;
        }

        if (r.status === 'failed' || r.status === 'done') {
          this.form.patchValue({
            amount: 0
          });
        }

      });


    this.createForm();
  }

  private createForm() {
    this.form = this.fb.group({
      amount: [0, [Validators.required]],
      operationType: [this.depositOperationChoice, [
        Validators.required,
        Validators.minLength(1)
      ]]
    })
  }

  resetError() {
    this.error = null;
  }

  submit() {
    const amount = this.form.value.amount as number;
    const operationType = this.form.value.operationType as string;

    if (operationType === this.depositOperationChoice) {
      this.store.dispatch(new DepositRequestAction(amount));
    } else {
      this.store.dispatch(new WithdrawRequestAction(amount));
    }

  }

}
