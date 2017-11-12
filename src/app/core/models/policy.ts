export enum PolicyCategory {
    LocalRule = <any>"Local Rules",
    Handicaps = <any>"Handicaps and Scoring",
    ClubPolicy = <any>"Club Policy",
    PaymentFaq = <any>"Payment FAQs",
    NewMember = <any>"New Member Information",
    AboutUs = <any>"About US",
}

export class Policy {
    id: number;
    category: PolicyCategory;
    title: string;
    description: string;

    fromJson(json: any): Policy {
        this.id = json.id;
        this.category = this.translateCategory(json.policy_type);
        this.title = json.title;
        this.description = json.description;
        return this;
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
