import moment from 'moment';
import { isEmpty } from 'lodash';

export class StripeCharge {
    id = '';
    amount = 0;
    description = '';
    status = '';
    card = '';
    memberName = '';
    createDate: any;
    detail: any;

    constructor(obj: any) {
        if (!isEmpty(obj)) {
            const charge = this.fromJson(obj);
            Object.assign(this, charge);
        }
    }

    get createDateFormatted(): string {
        if (this.createDate) {
            return this.createDate.format('YYYY-MM-DD h:mm:ss a');
        }
        return '';
    }

    private fromJson(json: any): any {
        const obj: {[index: string]: any} = {};
        obj.id = json.id;
        obj.amount = +json.amount / 100;
        obj.createDate = moment.unix(json.created);
        obj.description = json.description;
        obj.status = json.status;
        obj.memberName = json.metadata.member;
        obj.card = `${json.source.brand} ending with ${json.source.last4}`;
        obj. detail = json;
        return obj;
    }
}
