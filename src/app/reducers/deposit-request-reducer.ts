import { DepositRequest } from '.';
import { Action } from '@ngrx/store';
import { DepositError } from '../services/deposit.service';

const initialState: DepositRequest = {
    status: 'unknown',
    amount: 0,
    failureReason: ''
}
export function depositRequestReducer(state = initialState, action: ActionsUnion): DepositRequest {
    switch (action.type) {
        case DepositActionTypes.Success:
            return {
                ...state,
                status: 'done',
                failureReason: ''
            }
        case DepositActionTypes.Failure:
            const error = ((action as DepositFailureAction).error) as Error;
            return {
                ...state,
                status: 'failed',
                failureReason: error.message
            }
        case DepositActionTypes.InProgress:
            return {
                ...state,
                status: 'in_progress',
                failureReason: ''
            }
        case DepositActionTypes.Clear:
            return {
                ...state,
                status: 'unknown',
                failureReason: '',
                amount: 0
            }
        default:
            return state
    }
}


export type ActionsUnion = DepositRequestAction | DepositSuccessAction
    | DepositFailureAction | DepositInProgressAction;

class BaseAction implements Action {
    constructor(public type: string, public requestAmount: number) { }
}

export class DepositRequestAction extends BaseAction {
    constructor(amount: number) {
        super(DepositActionTypes.Request, amount);
    }
}

export class DepositSuccessAction extends BaseAction {
    constructor(amount: number, public newBalance: number) {
        super(DepositActionTypes.Success, amount);
    }
}

export class DepositFailureAction extends BaseAction {
    constructor(amount: number, public error: Error) {
        super(DepositActionTypes.Failure, amount);
    }
}

export class DepositInProgressAction extends BaseAction {
    constructor(amount: number) {
        super(DepositActionTypes.InProgress, amount);
    }
}

export class DepositClearAction extends BaseAction {
    constructor() {
        super(DepositActionTypes.Clear, 0);
    }
}

export enum DepositActionTypes {
    Request = '[Dashboard Page] Deposit Request',
    Success = '[API] Deposit Success',
    Failure = '[API] Deposit Failure',
    InProgress = '[API] Deposit In Progress',
    Clear = '[Internal] Deposit Clear',
}