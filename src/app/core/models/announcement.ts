import * as moment from 'moment';

export class Announcement {
    id: number;
    title: string;
    text: string;
    starts: any;
    expires: any;
    eventId: number;
    eventName: string;
    membersOnly: boolean;
    externalUrl: string;
    externalUrlName: string;
    documentName: string;
    documentUrl: string;

    isVisible(isAuth: boolean): boolean {
        if (isAuth) {
            return true;
        }
        return !this.membersOnly;
    }

    fromJson(json: any): Announcement {
        this.id = json.id;
        this.title = json.title;
        this.text = json.text;
        this.starts = moment(json.starts);
        this.expires = moment(json.expires);
        this.eventId = json.event ? json.event.id : null;
        this.eventName = json.event ? json.event.name : null;
        this.membersOnly = json.members_only;
        this.externalUrl = json.external_url;
        this.externalUrlName = json.external_name;
        this.documentName = json.document ? json.document.title : null;
        this.documentUrl = json.document ? json.document.file.url : null;
        return this;
    }
}
