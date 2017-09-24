declare const moment: any;

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
        this.eventId = json.event_id;
        this.eventName = json.event_name;
        this.membersOnly = json.members_only;
        this.externalUrl = json.external_url;
        this.externalUrlName = json.external_name;
        this.documentName = json.document_name;
        this.documentUrl = json.document_url;
        return this;
    }
}
