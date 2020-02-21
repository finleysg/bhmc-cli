import { EventDetail, StartType } from './event-detail';
import { EventType } from './event-detail';
import moment from 'moment';
import { isEmpty } from 'lodash';

export class CalendarEvent {
    id = 0;
    name = '';
    description = '';
    rounds = 0;
    startType: StartType = StartType.NA;
    registrationWindow?: string;
    externalUrl?: string;
    eventType: EventType = EventType.Other;
    startDate: any;
    startTime?: string;
    endDate: any;
    signupStart: any;
    signupEnd: any;

    constructor(obj: any) {
        if (!isEmpty(obj)) {
            const calendarEvent = this.fromJson(obj);
            Object.assign(this, calendarEvent);
        }
    }

    eventTypeClass(): string {
        const eventClass = this.eventType.toString().replace(' ', '-').toLowerCase();
        return eventClass.replace(' ', '-');
    }

    private fromJson(json: any): any {
        const obj: {[index: string]: any} = {};
        obj.id = json.id;
        obj.name = json.name;
        obj.description = json.description;
        obj.rounds = json.rounds;
        obj.startType = EventDetail.getStartType(json.start_type);
        obj.registrationWindow = json.registration_window;
        obj.externalUrl = json.external_url;
        obj.eventType = EventDetail.getEventType(json.event_type);
        obj.startDate = moment(json.start_date);
        obj.startTime = json.start_time;
        obj.signupStart = moment(json.signup_start);
        obj.signupEnd = moment(json.signup_end);
        if (obj.rounds <= 1) {
            obj.endDate = moment(json.start_date);
        } else {
            obj.endDate = moment(json.start_date).add(obj.rounds - 1, 'days');
        }
        return obj;
    }
}
