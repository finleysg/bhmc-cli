import { EventRegistration } from './event-registration';
import { DocumentType, EventDocument } from './event-document';
declare const moment: any;

export class EventDetail {
    id: number;
    name: string;
    description: string;
    notes: string;
    rounds: number;
    holesPerRound: number;
    eventFee: number;
    eventFeeAlt: number;
    skinsFee: number;
    greensFee: number;
    cartFee: number;
    groupSize: number;
    startType: StartType;
    canSignupGroup: boolean;
    canChooseHole: boolean;
    registrationWindow: RegistrationWindowType;
    externalUrl: string;
    eventType: EventType;
    skinsType: SkinsType;
    seasonPoints: number;
    requiresRegistration: boolean;
    startDate: any;
    startTime: string;
    enablePayments: boolean;
    signupStart: any;
    signupEnd: any;
    registrationMaximum: number;
    documents: EventDocument[];
    registrations: EventRegistration[];

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
        }
        return eventType;
    }

    static getEventCode(eventType: EventType): string {
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

    isRegistered(memberId: number): boolean {
        if (!this.registrations) {
            return false;
        }
        return this.registrations.some(r => r.memberId === memberId);
    }

    get canRegister(): boolean {
        return this.requiresRegistration &&
               this.registrationWindow === RegistrationWindowType.Registering;
    }

    getDocument(type: DocumentType): EventDocument {
        if (this.documents && this.documents.length > 0) {
            let docs = this.documents.filter(d => d.type === type);
            if (docs && docs.length === 1) {
                return docs[0];
            }
        }
        return null;
    }

    getDocuments(type: DocumentType): EventDocument[] {
        if (this.documents && this.documents.length > 0) {
            return this.documents.filter(d => d.type === type);
        }
        return null;
    }

    get canViewRegistrations(): boolean {
        return this.requiresRegistration &&
               this.registrationWindow !== RegistrationWindowType.Future;
    }

    get teeTimes(): EventDocument {
        if (this.documents) {
            let document = this.documents.filter( e => {
                return e.type === DocumentType.Teetimes;
            });
            // TODO: what if there are more than one?
            if (document && document.length === 1) {
                return document[0];
            }
        }
        return undefined;
    }

    get results(): EventDocument {
        if (this.documents) {
            let document = this.documents.filter( e => {
                return e.type === DocumentType.Results;
            });
            // TODO: what if there are more than one?
            if (document && document.length === 1) {
                return document[0];
            }
        }
        return undefined;
    }

    fromJson(json: any): EventDetail {
        this.id = json.id;
        this.name = json.name;
        this.description = json.description;
        this.notes = json.notes;
        this.holesPerRound = json.holes_per_round;
        this.eventFee = +json.event_fee;
        this.eventFeeAlt = +json.alt_event_fee;
        this.skinsFee = +json.skins_fee;
        this.greensFee = +json.green_fee;
        this.cartFee = +json.cart_fee;
        this.groupSize = +json.group_size;
        this.startType = EventDetail.getStartType(json.start_type);
        this.canSignupGroup = json.can_signup_group;
        this.canChooseHole = json.can_choose_hole;
        this.registrationWindow = json.registration_window;
        this.externalUrl = json.external_url;
        this.eventType = EventDetail.getEventType(json.event_type);
        this.skinsType = EventDetail.getSkinsType(json.skins_type);
        this.seasonPoints = +json.season_points;
        this.requiresRegistration = json.requires_registration;
        this.startDate = moment(json.start_date);
        this.startTime = json.start_time;
        this.enablePayments = json.enable_payments;
        this.signupStart = moment(json.signup_start);
        this.signupEnd = moment(json.signup_end);
        this.registrationMaximum = json.registration_maximum;

        if (json.documents && json.documents.length > 0) {
            this.documents = [];
            json.documents.forEach((d: any) => this.documents.push(new EventDocument().fromJson(d)));
        }

        if (json.registrations && json.registrations.length > 0) {
            this.registrations = [];
            json.registrations.forEach((r: any) => this.registrations.push(new EventRegistration().fromJson(r)));
        }

        return this;
    }
}

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
    Deadline = <any>'Deadline'
}

export enum SkinsType {
    Individual = <any>'Individual',
    Team = <any>'Team',
    None = <any>'No Skins'
}
