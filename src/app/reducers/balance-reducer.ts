import { Action } from '@ngrx/store';

const initialState = 0;
export function balanceReducer(state = initialState, action: BalanceActionsUnion): number {
    switch (action.type) {
        case BalanceActionTypes.Set:
        case BalanceActionTypes.Withdraw:
        case BalanceActionTypes.Deposit:
            return action.amount;

        default:
            return state
    }
}


export type BalanceActionsUnion = SetBalanceAction | UpdateBalanceAfterDepositAction | UpdateBalanceAfterWithdrawAction;


// no need to export this class as it won't be used from other files
class BaseAction implements Action {
    constructor(public type: string, public amount: number) { }
}

export class UpdateBalanceAfterDepositAction extends BaseAction {
    constructor(amount: number) {
        super(BalanceActionTypes.Deposit, amount);
    }
}

export class UpdateBalanceAfterWithdrawAction extends BaseAction {
    constructor(amount: number) {
        super(BalanceActionTypes.Withdraw, amount);
    }
}

export class SetBalanceAction extends BaseAction {
    constructor(amount: number) {
        super(BalanceActionTypes.Set, amount);
    }
}


export enum BalanceActionTypes {
    Set = '[API] First App Start',
    Deposit = '[API] Deposit',
    Withdraw = '[API] Withdraw',
}