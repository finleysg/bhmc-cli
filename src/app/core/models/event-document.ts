import moment from 'moment';
import { isEmpty } from 'lodash';

export enum DocumentType {
    Results = <any>'Event Results',
    Teetimes = <any>'Event Tee Times',
    SeasonPoints = <any>'Season Long Points',
    DamCup = <any>'Dam Cup',
    MatchPlay = <any>'Match Play',
    Financial = <any>'Financial Statements',
    SignUp = <any>'Sign Up',
    Other = <any>'Other'
}

export class EventDocument {
    id = 0;
    title = '';
    url = '';
    type = DocumentType.Other;
    year = 0;
    eventId?: number;
    displayFlag = false;
    lastUpdate: any;

    constructor(obj: any) {
        if (!isEmpty(obj)) {
            const doc = this.fromJson(obj);
            Object.assign(this, doc);
        }
    }

    static getDocumentType(shortType: string): DocumentType {
        let documentType = DocumentType.Other;
        if (shortType === 'R') {
            documentType = DocumentType.Results;
        } else if (shortType === 'T') {
            documentType = DocumentType.Teetimes;
        } else if (shortType === 'P') {
            documentType = DocumentType.SeasonPoints;
        } else if (shortType === 'D') {
            documentType = DocumentType.DamCup;
        } else if (shortType === 'M') {
            documentType = DocumentType.MatchPlay;
        } else if (shortType === 'F') {
            documentType = DocumentType.Financial;
        } else if (shortType === 'S') {
            documentType = DocumentType.SignUp;
        }
        return documentType;
    }

    static getDocumentCode(longType?: DocumentType): string {
        if (longType === DocumentType.Results) {
            return 'R';
        } else if (longType === DocumentType.Teetimes) {
            return 'T';
        } else if (longType === DocumentType.SeasonPoints) {
            return 'P';
        } else if (longType === DocumentType.DamCup) {
            return 'D';
        } else if (longType === DocumentType.MatchPlay) {
            return 'M';
        } else if (longType === DocumentType.Financial) {
            return 'F';
        } else if (longType === DocumentType.SignUp) {
            return 'S';
        }
        return 'O';
    }

    private fromJson(json: any): any {
        const obj: {[index: string]: any} = {};
        obj.id = json.id;
        obj.title = json.title;
        obj.url = json.file;
        obj.eventId = json.event;
        obj.type = EventDocument.getDocumentType(json.document_type);
        obj.year = json.year;
        obj.lastUpdate = moment(json.last_update);
        obj.displayFlag = json.display_flag;
        return obj;
    }
}
