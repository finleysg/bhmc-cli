import { isEmpty } from 'lodash';

export class SavedCard {
    id = '';
    brand = '';
    last4 = '';
    expMonth = 0;
    expYear = 0;

    constructor(obj: any) {
        if (!isEmpty(obj)) {
            const card = this.fromJson(obj);
            Object.assign(this, card);
        }
    }

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
        return `${this.expMonth && this.expMonth < 10 ? '0' : ''}${this.expMonth}/${this.expYear}`;
    }

    private fromJson(json: any): any {
        const obj: {[index: string]: any} = {};
        obj.id = json.stripe_id;
        obj.brand = json.brand;
        obj.last4 = json.last4;
        obj.expMonth = +json.exp_month;
        obj.expYear = +json.exp_year;
        return obj;
    }
}
