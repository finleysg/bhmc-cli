import { EventDetail, StartType } from './event-detail';
import { EventType } from './event-detail';
declare const moment: any;

export class CalendarEvent {
    id: number;
    name: string;
    description: string;
    rounds: number;
    startType: StartType;
    registrationWindow: string;
    externalUrl: string;
    eventType: EventType;
    startDate: any;
    startTime: string;
    endDate: any;
    signupStart: any;
    signupEnd: any;

    eventTypeClass(): string {
        return this.eventType.toString().replace(' ', '-').toLowerCase();
    }

    fromJson(json: any): CalendarEvent {
        this.id = json.id;
        this.name = json.name;
        this.description = json.description;
        this.rounds = json.rounds;
        this.startType = EventDetail.getStartType(json.start_type);
        this.registrationWindow = json.registration_window;
        this.externalUrl = json.external_url;
        this.eventType = EventDetail.getEventType(json.event_type);
        this.startDate = moment(json.start_date);
        this.startTime = json.start_time;
        this.signupStart = moment(json.signup_start);
        this.signupEnd = moment(json.signup_end);
        if (this.rounds <= 1) {
            this.endDate = moment(json.start_date);
        } else {
            this.endDate = moment(json.start_date).add(this.rounds -1, 'days');
        }
        return this;
    }
}
