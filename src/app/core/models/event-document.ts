declare const moment: any;

export class EventDocument {
    id: number;
    title: string;
    url: string;
    type: DocumentType;
    year: number;
    eventId: number;
    lastUpdate: any;

    fromJson(json: any): EventDocument {
        this.id = json.id;
        this.title = json.title;
        this.url = json.file;
        this.eventId = json.event;
        this.type = EventDocument.getDocumentType(json.document_type);
        this.year = json.year;
        this.lastUpdate = moment(json.last_update);
        return this;
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

    static getDocumentCode(longType: DocumentType): string {
        if (longType === DocumentType.Results) {
            return 'R';
        } else if (longType === DocumentType.Teetimes) {
            return 'T'
        } else if (longType === DocumentType.SeasonPoints) {
            return 'P'
        } else if (longType === DocumentType.DamCup) {
            return 'D'
        } else if (longType === DocumentType.MatchPlay) {
            return 'M'
        } else if (longType === DocumentType.Financial) {
            return 'F'
        } else if (longType === DocumentType.SignUp) {
            return 'S'
        }
        return 'O';
    }
}

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
