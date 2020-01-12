import { EventRegistration } from './event-registration';
import { DocumentType, EventDocument } from './event-document';
import moment from 'moment';
import { isEmpty } from 'lodash';

// No friendly name - used for logic, not display
export enum RegistrationWindowType {
    Future = <any>'future',
    Registering = <any>'registration', // in the registration window
    Pending = <any>'pending', // between signup end and the event
    Past = <any>'past',
    NA = <any>'n/a'
}

export enum StartType {
    Shotgun = <any>'Shotgun',
    Teetimes = <any>'Tee Times',
    NA = <any>'Not Applicable'
}

export enum EventType {
    League = <any>'League',
    Major = <any>'Weekend Major',
    Holiday = <any>'Holiday Pro-shop Event',
    Meeting = <any>'Member Meeting',
    BoardMeeting = <any>'Board Meeting',
    Other = <any>'Other',
    State = <any>'State Tournament',
    Registration = <any>'Open Registration Period',
    Deadline = <any>'Deadline',
    Canceled = <any>'Canceled'
}

export enum SkinsType {
    Individual = <any>'Individual',
    Team = <any>'Team',
    None = <any>'No Skins'
}

export class EventDetail {
    id = 0;
    name = '';
    description?: string;
    notes?: string;
    rounds = 0;
    holesPerRound = 0;
    eventFee = 0;
    eventFeeAlt = 0;
    skinsFee = 0;
    greensFee = 0;
    cartFee = 0;
    groupSize = 0;
    startType: StartType = StartType.NA;
    canSignupGroup = false;
    canChooseHole = false;
    registrationWindow: RegistrationWindowType = RegistrationWindowType.NA;
    externalUrl?: string;
    eventType: EventType = EventType.Other;
    skinsType: SkinsType = SkinsType.None;
    seasonPoints = 0;
    requiresRegistration = false;
    startDate: any;
    startTime?: string;
    enablePayments = false;
    signupStart: any;
    signupEnd: any;
    skinsEnd: any;
    registrationMaximum = 0;
    portalUrl?: string;
    documents: EventDocument[] = [];
    registrations: EventRegistration[] = [];

    constructor(obj: any) {
        if (!isEmpty(obj)) {
            const event = this.fromJson(obj);
            if (obj.slots) {
                event.documents = obj['documents'].map((o: any) => {
                    const doc = new EventDocument(o);
                    doc.eventId = obj.eventId;
                    return doc;
                });
            }
            if (obj.registrations) {
                event.registrations = obj['registrations'].map((o: any) => new EventRegistration(o));
            }
            Object.assign(this, event);
        }
    }

    static getEventType(shortType: string): EventType {
        let eventType = EventType.Other;
        if (shortType === 'L') {
            eventType = EventType.League;
        } else if (shortType === 'W') {
            eventType = EventType.Major;
        } else if (shortType === 'H') {
            eventType = EventType.Holiday;
        } else if (shortType === 'M') {
            eventType = EventType.Meeting;
        } else if (shortType === 'B') {
            eventType = EventType.BoardMeeting;
        } else if (shortType === 'S') {
            eventType = EventType.State;
        } else if (shortType === 'R') {
            eventType = EventType.Registration;
        } else if (shortType === 'D') {
            eventType = EventType.Deadline;
        } else if (shortType === 'X') {
            eventType = EventType.Canceled;
        }
        return eventType;
    }

    static getEventCode(eventType?: EventType): string {
        if (eventType === EventType.League) {
            return 'L';
        } else if (eventType === EventType.Major) {
            return 'W';
        }
        return 'TODO'; // the rest as a TODO
    }

    static getSkinsType(shortType: string): SkinsType {
        let skinsType = SkinsType.None;
        if (shortType === 'I') {
            skinsType = SkinsType.Individual;
        } else if (shortType === 'T') {
            skinsType = SkinsType.Team;
        }
        return skinsType;
    }

    static getStartType(shortType: string): StartType {
        let startType = StartType.NA;
        if (shortType === 'TT') {
            startType = StartType.Teetimes;
        } else if (shortType === 'SG') {
            startType = StartType.Shotgun;
        }
        return startType;
    }

    get eventTypeName(): string {
        let name = 'Other';
        if (this.eventType === EventType.League) {
            name = 'Weekday Event';
        } else if (this.eventType === EventType.Major) {
            name = 'Weekend Major';
        } else if (this.eventType === EventType.Holiday) {
            name = 'Holiday Proshop Event';
        } else if (this.eventType === EventType.Meeting) {
            name = 'Member Meeting';
        } else if (this.eventType === EventType.BoardMeeting) {
            name = 'Board Meeting';
        } else if (this.eventType === EventType.State) {
            name = 'MGA or MPGA Tournament';
        } else if (this.eventType === EventType.Registration) {
            name = 'Open Registration Period';
        } else if (this.eventType === EventType.Deadline) {
            name = 'Deadline';
        } else if (this.eventType === EventType.Canceled) {
            name = 'Canceled';
        }
        return name;
    }

    isRegistered(memberId: number): boolean {
        if (!this.registrations) {
            return false;
        }
        return this.registrations.some(r => r.memberId === memberId && r.status === 'R');
    }

    get canRegister(): boolean {
        return this.requiresRegistration &&
               this.eventType !== EventType.Canceled &&
               this.registrationWindow === RegistrationWindowType.Registering;
    }

    getDocument(type: DocumentType): EventDocument | undefined {
        if (this.documents && this.documents.length > 0) {
            const docs = this.documents.filter(d => d.type === type);
            if (docs && docs.length === 1) {
                return docs[0];
            }
        }
        return undefined;
    }

    getDocuments(type: DocumentType): EventDocument[] {
        if (this.documents && this.documents.length > 0) {
            return this.documents.filter(d => d.type === type);
        }
        return [];
    }

    get canViewRegistrations(): boolean {
        return this.requiresRegistration &&
               this.registrationWindow !== RegistrationWindowType.Future;
    }

    get teeTimes(): EventDocument | null {
        if (this.documents) {
            const document = this.documents.filter( e => {
                return e.type === DocumentType.Teetimes;
            });
            // TODO: what if there are more than one?
            if (document && document.length === 1) {
                return document[0];
            }
        }
        return null;
    }

    get results(): EventDocument | null {
        if (this.documents) {
            const document = this.documents.filter( e => {
                return e.type === DocumentType.Results;
            });
            // TODO: what if there are more than one?
            if (document && document.length === 1) {
                return document[0];
            }
        }
        return null;
    }

    fromJson(json: any): any {
        const obj: {[index: string]: any} = {};
        obj.id = json.id;
        obj.name = json.name;
        obj.description = json.description;
        obj.notes = json.notes;
        obj.holesPerRound = json.holes_per_round;
        obj.eventFee = +json.event_fee;
        obj.eventFeeAlt = +json.alt_event_fee;
        obj.skinsFee = +json.skins_fee;
        obj.greensFee = +json.green_fee;
        obj.cartFee = +json.cart_fee;
        obj.groupSize = +json.group_size;
        obj.startType = EventDetail.getStartType(json.start_type);
        obj.canSignupGroup = json.can_signup_group;
        obj.canChooseHole = json.can_choose_hole;
        obj.registrationWindow = json.registration_window;
        obj.externalUrl = json.external_url;
        obj.eventType = EventDetail.getEventType(json.event_type);
        obj.skinsType = EventDetail.getSkinsType(json.skins_type);
        obj.seasonPoints = +json.season_points;
        obj.requiresRegistration = json.requires_registration;
        obj.startDate = moment(json.start_date);
        obj.startTime = json.start_time;
        obj.enablePayments = json.enable_payments;
        obj.signupStart = json.signup_start ? moment(json.signup_start) : null;
        obj.signupEnd = json.signup_end ? moment(json.signup_end) : null;
        obj.skinsEnd = json.skins_end ? moment(json.skins_end) : null;
        obj.registrationMaximum = json.registration_maximum;
        obj.portalUrl = json.portal_url;

        return obj;
    }
}
