import { isEmpty } from 'lodash';

export enum PolicyCategory {
    LocalRule = <any>'Local Rules',
    Handicaps = <any>'Handicaps and Scoring',
    ClubPolicy = <any>'Club Policy',
    PaymentFaq = <any>'Payment FAQs',
    NewMember = <any>'New Member Information',
    AboutUs = <any>'About US',
}

export class Policy {
    id = 0;
    category: PolicyCategory = PolicyCategory.ClubPolicy;
    title = '';
    description = '';

    constructor(obj: any) {
        if (!isEmpty(obj)) {
            const policy = this.fromJson(obj);
            Object.assign(this, policy);
        }
    }

    private fromJson(json: any): any {
        const obj: {[index: string]: any} = {};
        obj.id = json.id;
        obj.category = this.translateCategory(json.policy_type);
        obj.title = json.title;
        obj.description = json.description;
        return obj;
    }

    translateCategory(code: string): PolicyCategory {
        let category: PolicyCategory;
        switch (code) {
            case 'R':
                category = PolicyCategory.LocalRule;
                break;
            case 'S':
                category = PolicyCategory.Handicaps;
                break;
            case 'P':
                category = PolicyCategory.ClubPolicy;
                break;
            case 'N':
                category = PolicyCategory.NewMember;
                break;
            case 'A':
                category = PolicyCategory.AboutUs;
                break;
            case 'F':
                category = PolicyCategory.PaymentFaq;
                break;
            default:
                category = PolicyCategory.ClubPolicy;
                break;
        }
        return category;
    }
}
