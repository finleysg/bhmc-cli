import moment from 'moment';
import { isEmpty } from 'lodash';

export class Announcement {
    id = 0;
    title = '';
    text = '';
    starts: any;
    expires: any;
    eventId?: number;
    eventName?: string;
    membersOnly = false;
    externalUrl?: string;
    externalUrlName?: string;
    documentName?: string;
    documentUrl?: string;

    constructor(obj: any) {
        if (!isEmpty(obj)) {
            const announcement = this.fromJson(obj);
            Object.assign(this, announcement);
        }
    }
    isVisible(isAuth: boolean): boolean {
        if (isAuth) {
            return true;
        }
        return !this.membersOnly;
    }

    private fromJson(json: any): any {
        const obj: {[index: string]: any} = {};
        obj.id = json.id;
        obj.title = json.title;
        obj.text = json.text;
        obj.starts = moment(json.starts);
        obj.expires = moment(json.expires);
        obj.eventId = json.event ? json.event.id : null;
        obj.eventName = json.event ? json.event.name : null;
        obj.membersOnly = json.members_only;
        obj.externalUrl = json.external_url;
        obj.externalUrlName = json.external_name;
        obj.documentName = json.document ? json.document.title : null;
        obj.documentUrl = json.document ? json.document.file.url : null;
        return obj;
    }
}
