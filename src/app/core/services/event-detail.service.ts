import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { EventSignupTable } from '../../features/events/models/event-signup-table';
import { EventRegistration } from '../models/event-registration';
import { EventRegistrationGroup } from '../models/event-registration-group';
import { BhmcDataService } from './bhmc-data.service';
import { EventDetail, EventType } from '../models/event-detail';
import { RegistrationRow } from '../../features/events/models/registration-row';
import { map } from 'rxjs/operators';

@Injectable()
export class EventDetailService {

    private currentEventId: number;
    private signupTableSources: Map<number, BehaviorSubject<EventSignupTable>>;
    private signupTables: Map<number, Observable<EventSignupTable>>;
    public registrationGroup: EventRegistrationGroup;
    public currentEvent: EventDetail;

    constructor(private dataService: BhmcDataService) { }

    getEventDetail(id: number): Observable<EventDetail> {
        this.currentEventId = id;
        return this.dataService.getApiRequest(`events/${id}`).pipe(
            map(data => {
                const event = new EventDetail().fromJson(data);
                const courses = this.eventCourses(event);
                this.signupTableSources = new Map<number, BehaviorSubject<EventSignupTable>>();
                this.signupTables = new Map<number, Observable<EventSignupTable>>();
                courses.forEach(c => {
                    let table = new BehaviorSubject(this.createSignupTable(event, c));
                    this.signupTableSources.set(c.id, table);
                    this.signupTables.set(c.id, table.asObservable());
                });
                this.currentEvent = event;
                return event;
            }));
    }

    refreshEventDetail(): Observable<void> {
        // TODO: tap instead of map?
        return this.dataService.getApiRequest(`events/${this.currentEventId}`).pipe(
            map((data: any) => {
                const event = new EventDetail().fromJson(data);
                const courses = this.eventCourses(event);
                courses.forEach(c => {
                    let table = this.createSignupTable(event, c);
                    this.signupTableSources.get(c.id).next(table);
                });
                this.currentEvent = event;
                return;
            }));
    }
    
    updateEventPortal(event: EventDetail): Observable<EventDetail> {
        const data = {
            portal: event.portalUrl
        };
        return this.dataService.postApiRequest(`events/${event.id}/portal`, data).pipe(
            map((json: any) => {
                const evt = new EventDetail().fromJson(json);
                const courses = this.eventCourses(evt);
                courses.forEach(c => {
                    let table = this.createSignupTable(evt, c);
                    this.signupTableSources.get(c.id).next(table);
                });
                this.currentEvent = evt;
                return this.currentEvent;
            })
        );
    }

    signupTable(id: number): Observable<EventSignupTable> {
        return this.signupTables.get(id);
    }

    eventCourses(eventDetail: EventDetail): any[] {
        // pull all the courses out of the existing registrations
        let tmp = {};
        let courses: any[]  = [];
        if (eventDetail.registrations) {
            courses = eventDetail.registrations.reduce((result: any[], item: any) => {
                if (!tmp[item.courseSetupId]) {
                    tmp[item.courseSetupId] = item.courseName;
                    result.push({
                        id: +item.courseSetupId,
                        name: item.courseName
                    });
                }
                return result;
            }, []);
        } else {
            courses.push({id: 0, name: 'In the Event'});
        }
        return courses;
    }

    createSignupTable(eventDetail: EventDetail, course: any): EventSignupTable {
        // each table is a hierarchy: course --> rows --> slots
        let table = new EventSignupTable(course.id, course.name);
        if (eventDetail.eventType === EventType.League) {
            for (let h = 1; h <= eventDetail.holesPerRound; h++) {
                const aGroups = eventDetail.registrations.filter((reg: EventRegistration) => {
                    return reg.courseSetupId === course.id && reg.startingOrder === 0 && reg.holeNumber === h;
                });
                const bGroups = eventDetail.registrations.filter((reg: EventRegistration) => {
                    return reg.courseSetupId === course.id && reg.startingOrder === 1 && reg.holeNumber === h;
                });
                table.rows.push(RegistrationRow.create(aGroups));
                table.rows.push(RegistrationRow.create(bGroups));
            }
        } else {
            if (eventDetail.registrations) {
                // Reduce existing registrations to an associative array: groupId -> registrations
                let groups = eventDetail.registrations.reduce(function (grouped: any, item: EventRegistration) {
                    let key = item.groupId;
                    grouped[key] = grouped[key] || [];
                    grouped[key].push(item);
                    return grouped;
                }, {});
                // Push each group into a row in the table (display only for non-league events)
                for (let prop in groups) {
                    if (groups.hasOwnProperty(prop)) {
                        table.rows.push(RegistrationRow.create(groups[prop]));
                    }
                }
            }
        }
        return table;
    }
}
