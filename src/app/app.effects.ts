import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { DepositActionTypes, DepositRequestAction, DepositFailureAction, DepositSuccessAction, DepositInProgressAction, DepositClearAction } from './reducers/deposit-request-reducer';
import { of } from 'rxjs';
import { DepositService } from './services/deposit.service';
import { UpdateBalanceAfterDepositAction, UpdateBalanceAfterWithdrawAction } from './reducers/balance-reducer';
import { WithdrawService } from './services/withdraw.service';
import { WithdrawActionTypes, WithdrawRequestAction, WithdrawInProgressAction, WithdrawSuccessAction, WithdrawFailureAction, WithdrawClearAction } from './reducers/withdraw-request-reducer';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private _deposit: DepositService,
    private _withdraw: WithdrawService
  ) { }


  @Effect()
  depositRequestsPreFlight$ = this.actions$.pipe(
    ofType(DepositActionTypes.Request),

    // validate action
    map((a: DepositRequestAction) => new DepositInProgressAction(a.requestAmount))
  );

  @Effect()
  depositRequests$ = this.actions$.pipe(
    ofType(DepositActionTypes.Request),

    // validate action
    mergeMap(
      (a: DepositRequestAction) => this._deposit.deposit(a.requestAmount).pipe(
        map(newBalance => new DepositSuccessAction(a.requestAmount, newBalance)),
        catchError(err => of(new DepositFailureAction(a.requestAmount, err)))
      )
    ),

  );

  @Effect()
  depositSuccess$ = this.actions$.pipe(
    ofType(DepositActionTypes.Success),
    map((a: DepositSuccessAction) => new UpdateBalanceAfterDepositAction(a.newBalance))
  );

  @Effect()
  depositFailure$ = this.actions$.pipe(
    ofType(DepositActionTypes.Failure, DepositActionTypes.Success),
    map(() => new DepositClearAction())
  );

  // withdraw

  @Effect()
  withdrawRequestsPreFlight$ = this.actions$.pipe(
    ofType(WithdrawActionTypes.Request),

    // validate action
    map((a: WithdrawRequestAction) => new WithdrawInProgressAction(a.requestAmount))
  );

  @Effect()
  withdrawRequests$ = this.actions$.pipe(
    ofType(WithdrawActionTypes.Request),

    // validate action
    mergeMap(
      (a: WithdrawRequestAction) => this._withdraw.withdraw(a.requestAmount).pipe(
        map(newBalance => new WithdrawSuccessAction(a.requestAmount, newBalance)),
        catchError(err => of(new WithdrawFailureAction(a.requestAmount, err)))
      )
    ),

  );

  @Effect()
  withdrawSuccess$ = this.actions$.pipe(
    ofType(WithdrawActionTypes.Success),
    map((a: WithdrawSuccessAction) => new UpdateBalanceAfterWithdrawAction(a.newBalance))
  );

  @Effect()
  withdrawFailure$ = this.actions$.pipe(
    ofType(WithdrawActionTypes.Failure, WithdrawActionTypes.Success),
    map((a) => new WithdrawClearAction())
  );
}
