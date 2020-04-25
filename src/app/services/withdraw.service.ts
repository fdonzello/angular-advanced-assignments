import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { delay, first, mergeMap, tap } from 'rxjs/operators';
import { InvalidAmountError } from './deposit.service';
import { InsufficentFundsError } from '../errors';

@Injectable({
  providedIn: 'root'
})
export class WithdrawService {


  constructor(private store: Store<AppState>) { }

  // withdraw simulates a network call and returns
  // the new balance.
  // The Store will be use to retrieve the current
  // balance. In a real world, the current balance
  // would be retrieved on the API Server applying
  // the operation.
  withdraw(amount: number): Observable<number> {
    return this.store.select('balance')
      .pipe(
        delay(2000), // simulating network latency.
        first(), // we don't want to receive future balance updates, just the current one).

        // tap is only used to stop the flow in case of validation errors.
        tap(balance => {
          if (amount <= 0) {
            // API Server is returning an error becase we want
            // to withdraw $ 0,00.
            throw new InvalidAmountError();
          }

          if (balance < amount) {
            throw new InsufficentFundsError();
          }

        }),

        mergeMap((balance: number) => {
          // API Server is returning the updated balance.
          return of(balance - amount);
        })
      )
  }
}
