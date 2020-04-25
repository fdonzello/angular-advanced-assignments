import { Action } from '@ngrx/store';
import { WithdrawRequest } from '.';

const initialState: WithdrawRequest = {
    status: 'unknown',
    amount: 0,
    failureReason: ''
}
export function withdrawRequestReducer(state = initialState, action: ActionsUnion): WithdrawRequest {
    switch (action.type) {
        case WithdrawActionTypes.Success:
            return {
                ...state,
                status: 'done',
                failureReason: ''
            }
        case WithdrawActionTypes.Failure:
            const error = ((action as WithdrawFailureAction).error) as Error;
            return {
                ...state,
                status: 'failed',
                failureReason: error.message
            }
        case WithdrawActionTypes.InProgress:
            return {
                ...state,
                status: 'in_progress',
                failureReason: ''
            }
        case WithdrawActionTypes.Clear:
            return {
                ...state,
                amount: 0,
                status: 'unknown',
                failureReason: ''
            }
        default:
            return state
    }
}


export type ActionsUnion = WithdrawRequestAction | WithdrawSuccessAction
    | WithdrawFailureAction | WithdrawInProgressAction;

class BaseAction implements Action {
    constructor(public type: string, public requestAmount: number) { }
}

export class WithdrawRequestAction extends BaseAction {
    constructor(amount: number) {
        super(WithdrawActionTypes.Request, amount);
    }
}

export class WithdrawSuccessAction extends BaseAction {
    constructor(amount: number, public newBalance: number) {
        super(WithdrawActionTypes.Success, amount);
    }
}

export class WithdrawFailureAction extends BaseAction {
    constructor(amount: number, public error: Error) {
        super(WithdrawActionTypes.Failure, amount);
    }
}

export class WithdrawInProgressAction extends BaseAction {
    constructor(amount: number) {
        super(WithdrawActionTypes.InProgress, amount);
    }
}

export class WithdrawClearAction extends BaseAction {
    constructor() {
        super(WithdrawActionTypes.Clear, 0);
    }
}

export enum WithdrawActionTypes {
    Request = '[Dashboard Page] Withdraw Request',
    Success = '[API] Withdraw Success',
    Failure = '[API] Withdraw Failure',
    InProgress = '[API] Withdraw In Progress',
    Clear = '[Internal] Withdraw Clear',
}