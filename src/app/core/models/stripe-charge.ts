declare const moment: any;

export class StripeCharge {
    id: string;
    amount: number;
    description: string;
    status: string;
    card: string;
    memberName: string;
    createDate: any;
    detail: any;

    get createDateFormatted(): string {
        if (this.createDate) {
            return this.createDate.format('YYYY-MM-DD h:mm:ss a');
        }
        return '';
    }

    fromJson(json: any): StripeCharge {
        this.id = json.id;
        this.amount = +json.amount / 100;
        this.createDate = moment.unix(json.created);
        this.description = json.description;
        this.status = json.status;
        this.memberName = json.metadata.member;
        this.card = `${json.source.brand} ending with ${json.source.last4}`;
        this. detail = json;
        return this;
    }
}
