export class InvalidAmountError extends Error {
    constructor() {
        super();
        this.message = 'Provided amount is invalid'
    }
}

export class InsufficentFundsError extends Error {
    constructor() {
        super();
        this.message = 'Your balance does not cover this withdraw request'
    }
}