import { Injectable } from '@angular/core';
import { Observable ,  Subject ,  of } from 'rxjs';
import { EventRegistrationGroup } from '../models/event-registration-group';
import { BhmcDataService } from './bhmc-data.service';
import { RegistrationRow } from '../../features/events/models/registration-row';
import { StripeCharge } from '../models/stripe-charge';
import { SlotPayment } from '../models/slot-payment';
import { EventRegistration } from '../models/event-registration';
import { EventDetail } from '../models/event-detail';
import { map, tap, flatMap, mergeMap } from 'rxjs/operators';
import { merge } from 'lodash';

@Injectable()
export class RegistrationService {

    private group: EventRegistrationGroup;
    private registrationGroupSource: Subject<EventRegistrationGroup>;
    public registrationGroup$: Observable<EventRegistrationGroup>;
    private sessionRegistrations: number[]; // convenience collection of events registered for in the current session

    constructor(private dataService: BhmcDataService) {
        this.registrationGroupSource = new Subject<EventRegistrationGroup>();
        this.registrationGroup$ = this.registrationGroupSource.asObservable();
        this.sessionRegistrations = [];
    }

    loadGroup(id: number): void {
        this.dataService.getApiRequest(`registration/groups/${id}`)
            .subscribe((data: any) => {
                this.group = new EventRegistrationGroup().fromJson(data);
                this.registrationGroupSource.next(this.group);
            });
    }

    get currentGroup(): EventRegistrationGroup {
        return this.group;
    }

    reserve(id: number, row: RegistrationRow = null): Observable<void> {
        let payload: any = {
            event_id: id
        };
        if (row) {
            Object.assign(payload, {
                course_setup_hole_id: row.holeId,
                starting_order: row.startingOrder,
                slot_ids: row.selectedSlotIds
            });
        }
        return this.dataService.postApiRequest('registration/reserve', payload).pipe(
            tap((data: any) => {
                this.group = new EventRegistrationGroup().fromJson(data);
                this.registrationGroupSource.next(this.group);
            })
        );
    }

    register(group: EventRegistrationGroup): Observable<string> {
        return this.dataService.postApiRequest('registration/register', {'group': group.toJson()}).pipe(
            map((data: any) => {
                this.group = null; // start over
                this.registrationGroupSource.next(this.group);
                this.sessionRegistrations.push(group.eventId);
                return new EventRegistrationGroup().fromJson(data).paymentConfirmationCode;
            })
        );
    }

    registerUpdate(group: EventRegistrationGroup): Observable<string> {
        return this.dataService.putApiRequest('registration/register', {'group': group.toJson()}).pipe(
            map((data: any) => {
                this.group = null; // start over
                this.registrationGroupSource.next(this.group);
                this.sessionRegistrations.push(group.eventId);
                return new EventRegistrationGroup().fromJson(data).paymentConfirmationCode;
            })
        );
    }

    cancelReservation(group: EventRegistrationGroup): Observable<void> {
        return this.dataService.postApiRequest('registration/cancel', {group_id: group.id}).pipe(
            tap(() => {
                this.group = null;
                this.registrationGroupSource.next(this.group);
            })
        );
    }

    isRegistered(eventId: number, memberId: number): Observable<boolean> {
        if (!memberId) {  // anonymous user
            return of(false);
        } else if (this.sessionRegistrations.indexOf(eventId) >= 0) {
            return of(true);
        } else {
            return this.dataService.getApiRequest(`registration/${eventId}/${memberId}`).pipe(
                map((json: any) => {
                    return json.registered;
                })
            );
        }
    }

    // technically any holes with one group, but that always means par 3's
    addGroups(eventId: number): Observable<number> {
        return this.dataService.postApiRequest('registration/add-groups', {event_id: eventId}).pipe(
            map((data: any) => {
                return +data.groups_added;
            })
        );
    }

    getGroups(eventId: number): Observable<EventRegistrationGroup[]> {
        return this.dataService.getApiRequest('registration/groups', {event_id: eventId}).pipe(
            map((groups: any[]) => {
                return groups.map(g => new EventRegistrationGroup().fromJson(g));
            })
        );
    }

    getOpenSlots(eventId: number): Observable<EventRegistration[]> {
        return this.dataService.getApiRequest('registrations', {event_id: eventId, is_open: true}).pipe(
            map((registrations: any) => {
                return registrations.map(r => new EventRegistration().fromJson(r));
            })
        );
    }

    getRegistration(eventId: number, memberId: number): Observable<EventRegistration> {
        return this.dataService.getApiRequest('registrations', {event_id: eventId, member_id: memberId}).pipe(
            map((registrations: any) => {
                if (registrations.length === 1) {
                    return new EventRegistration().fromJson(registrations[0]);
                }
                return null;
            })
        );
    }

    getRegistrationGroup(eventId: number, memberId: number): Observable<EventRegistrationGroup> {
        return this.getRegistration(eventId, memberId).pipe(
            flatMap((reg: EventRegistration) => {
                if (reg) {
                    return this.dataService.getApiRequest(`registration/groups/${reg.groupId}`).pipe(
                        map((json: any) => {
                            return new EventRegistrationGroup().fromJson(json);
                        })
                    );
                } else {
                    return of(new EventRegistrationGroup());
                }
            })
        );
    }

    getPayments(eventId: number): Observable<StripeCharge[]> {
        return this.dataService.getApiRequest(`registration/charges/${eventId}`).pipe(
            map((charges: any[]) => {
                return charges.map(c => new StripeCharge().fromJson(c));
            })
        );
    }

    getPayment(chargeId: string): Observable<StripeCharge> {
        return this.dataService.getApiRequest('registration/charge', {id: chargeId}).pipe(
            map((charge: any) => {
                return new StripeCharge().fromJson(charge);
            })
        );
    }

    // Registration by an admin (cash)
    adminRegistration(event: EventDetail, registration: EventRegistration, payment: SlotPayment): Observable<any> {
        const payload: any = {
            event_id: event.id,
            member_id: registration.memberId,
            course_setup_hole_id: registration.holeId,
            starting_order: registration.startingOrder,
            slot_ids: [registration.id]
        };
        return this.dataService.postApiRequest('registration/reserve', payload).pipe(
            mergeMap((data: any) => {
                const group = new EventRegistrationGroup().fromJson(data);
                group.registrations[0] = merge({}, group.registrations[0], registration);
                group.copyPayment(payment);
                group.notes = 'Admin registration';
                return this.dataService.postApiRequest('registration/register', {'group': group.toJson()});
            })
        );
    }

    dropRegistration(reg: EventRegistration, refund: boolean): Observable<any> {
        return this.dataService.postApiRequest('registration/drop', {slot_id: reg.id, refund: refund});
    }

    moveRegistration(from: EventRegistration, to: EventRegistration): Observable<any> {
        return this.dataService.postApiRequest('registration/move', {from: from.id, to: to.id});
    }

    updateRegistration(reg: EventRegistration): Observable<EventRegistration> {
        return this.dataService.patchApiRequest(`registrations/${reg.id}`, reg.toJson()).pipe(
            map((data: any) => {
                return new EventRegistration().fromJson(data);
            })
        );
    }

    getSlotPayments(eventId: number): Observable<SlotPayment[]> {
        return this.dataService.getApiRequest('registration/slot-payments', {event_id: eventId}).pipe(
            map((payments: any[]) => {
                return payments.map(p => new SlotPayment().fromJson(p));
            })
        );
    }

    addSlotPayment(payment: SlotPayment): Observable<void> {
        return this.dataService.postApiRequest('registration/slot-payments', payment.toJson());
    }

    // updateSlotPayment(payment: SlotPayment): Observable<void> {
    //     return this.dataService.postApiRequest('registrations/slot-payments/' + payment.id, payment);
    // }
}
