import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { depositRequestReducer } from './deposit-request-reducer';
import { balanceReducer } from './balance-reducer';
import { withdrawRequestReducer } from './withdraw-request-reducer';


export interface AppState {
  balance: number;
  depositRequest: DepositRequest;
  withdrawRequest: WithdrawRequest;
}

export class BaseRequest {
  status: 'unknown' | 'in_progress' | 'done' | 'failed';
  amount: number;
  failureReason: string;
}

export class DepositRequest extends BaseRequest {
}

export class WithdrawRequest extends BaseRequest {
}

export const reducers: ActionReducerMap<AppState> = {
  balance: balanceReducer,
  depositRequest: depositRequestReducer,
  withdrawRequest: withdrawRequestReducer,
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
