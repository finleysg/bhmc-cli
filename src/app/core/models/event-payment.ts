export class EventPayment {
    readonly transactionFixedCost: number = 0.3;
    readonly transactionPercentage: number = 0.029;
    transactionFee: number;
    subtotal: number;
    total: number;

    constructor() {
        this.transactionFee = 0;
        this.subtotal = 0;
        this.total = 0;
    }

    update(subtotal: number): void {
        const total = (subtotal + this.transactionFixedCost) / (1.0 - this.transactionPercentage);
        this.total = +total.toFixed(2);
        this.subtotal = subtotal;
        this.transactionFee = this.total - this.subtotal;
    }
}
