export class SavedCard {
    id: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;

    get cardNumber(): string {
        if (this.brand === 'American Express') {
            return `**** ****** *${this.last4}`
        }
        return `**** **** **** ${this.last4}`;
    }

    get cvc(): string {
        if (this.brand === 'American Express') {
            return '****';
        }
        return '***';
    }

    get description(): string {
        return `${this.brand} ending in ${this.last4}`;
    }

    get expires(): string {
        return `${this.expMonth < 10 ? '0' : ''}${this.expMonth}/${this.expYear}`;
    }

    fromJson(json: any): SavedCard {
        this.id = json.stripe_id;
        this.brand = json.brand;
        this.last4 = json.last4;
        this.expMonth = +json.exp_month;
        this.expYear = +json.exp_year;
        return this;
    }
}
