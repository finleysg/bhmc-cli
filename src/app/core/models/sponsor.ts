export class Sponsor {
    id: number;
    name: string;
    description: string;
    website: string;
    level: string;
    imageUrl: string;

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

    fromJson(json: any): Sponsor {
        this.id = json.id;
        this.name = json.name;
        this.description = json.description;
        this.website = json.website;
        this.level = json.level;
        this.imageUrl = json.ad_image;
        return this;
    }
}
