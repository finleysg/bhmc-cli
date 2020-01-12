import { isEmpty } from 'lodash';

export class Sponsor {
    id = 0;
    name = '';
    description = '';
    website?: string;
    level = '';
    imageUrl?: string;

    constructor(obj: any) {
        if (!isEmpty(obj)) {
            const sponsor = this.fromJson(obj);
            Object.assign(this, sponsor);
        }
    }

    get levelName(): string {
        if (this.level === 'G') {
            return 'Gold';
        } else if (this.level === 'S') {
            return 'Silver';
        } else if (this.level === 'B') {
            return 'Bronze';
        } else {
            return 'Other';
        }
    }

    private fromJson(json: any): any {
        const obj: {[index: string]: any} = {};
        obj.id = json.id;
        obj.name = json.name;
        obj.description = json.description;
        obj.website = json.website;
        obj.level = json.level;
        obj.imageUrl = json.ad_image;
        return obj;
    }
}
