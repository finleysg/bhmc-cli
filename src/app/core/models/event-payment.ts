export class EventPayment {
    readonly transactionFixedCost: number = 0.3;
    readonly transactionPercentage: number = 0.029;
    transactionFee: number;
    subtotal: number;
    total: number;

    update(subtotal: number): void {
        let total = (subtotal + this.transactionFixedCost) / (1.0 - this.transactionPercentage);
        this.total = +total.toFixed(2);
        this.subtotal = subtotal;
        this.transactionFee = this.total - this.subtotal;
    };
}
