import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { delay, first, mergeMap, map, tap } from 'rxjs/operators';

export class DepositError extends Error { }
export class InvalidAmountError extends DepositError {
  constructor() {
    super();
    this.message = 'Provided amount is invalid'
  }
}

@Injectable({
  providedIn: 'root'
})
export class DepositService {

  constructor(private store: Store<AppState>) { }

  // deposit simulates a network call and returns
  // the new balance.
  // The Store will be use to retrieve the current
  // balance. In a real world, the current balance
  // would be retrieved on the API Server applying
  // the operation.
  deposit(amount: number): Observable<number> {
    return this.store.select('balance')
      .pipe(
        delay(2000), // simulating network latency.
        first(), // we don't want to receive future balance updates, just the current one).

        // tap is only used to stop the flow in case of validation errors.
        tap(() => {
          if (amount <= 0) {
            // API Server is returning an error becase we want
            // to deposit $ 0,00.
            throw new InvalidAmountError();
          }
        }),

        mergeMap((balance: number) => {
          // API Server is returning the updated balance.
          return of(balance + amount);
        })
      )
  }
}
