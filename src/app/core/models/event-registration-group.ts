import { EventRegistration } from './event-registration';
import { EventPayment } from './event-payment';
import { EventDetail } from './event-detail';
import { SlotPayment } from './slot-payment';
import { PublicMember } from './member';
import { User } from './user';
import moment from 'moment';
import { isEmpty } from 'lodash';

export class EventRegistrationGroup {
    id = 0;
    eventId = 0;
    courseSetupId?: number;
    courseName?: string;
    registrantId = -1;
    registrant = '';
    startingHole?: number;
    startingOrder?: number;
    notes?: string;
    cardVerificationToken?: string;
    paymentConfirmationCode?: string;
    paymentConfirmationDate?: any;
    payment: EventPayment = new EventPayment();
    registrations: EventRegistration[] = [];
    expires: any;

    constructor(obj: any) {
        if (!isEmpty(obj)) {
            const group = this.fromJson(obj);
            if (obj.slots) {
                group.registrations = obj['slots'].map((o: any) => new EventRegistration(o));
            } else {
                group.registrations = [];
            }
            Object.assign(this, group);
        }
    }

    static create(user: User): EventRegistrationGroup {
        const group = new EventRegistrationGroup({
            id: undefined
        });
        const reg = new EventRegistration({
            member: {
                id: user.member.id,
                first_name: user.firstName,
                last_name: user.lastName
            },
        });
        group.registrations.push(reg);
        return group;
    }

    static empty(): EventRegistrationGroup {
        const group = new EventRegistrationGroup({
            id: undefined
        });
        return group;
    }

    // get startingHoleName(): string {
    //     return `${this.startingHole}${this.startingOrder === 0 ? 'A' : 'B' }`;
    // }

    // get startingHoleName(): string {
    //     switch (this.startingHole) {
    //         case 1:
    //             return this.startingOrder === 0 ? '3:00' : '3:09';
    //         case 2:
    //             return this.startingOrder === 0 ? '3:18' : '3:27';
    //         case 3:
    //             return this.startingOrder === 0 ? '3:36' : '3:45';
    //         case 4:
    //             return this.startingOrder === 0 ? '3:54' : '4:03';
    //         case 5:
    //             return this.startingOrder === 0 ? '4:12' : '4:21';
    //         case 6:
    //             return this.startingOrder === 0 ? '4:30' : '4:39';
    //         case 7:
    //             return this.startingOrder === 0 ? '4:48' : '4:57';
    //         case 8:
    //             return this.startingOrder === 0 ? '5:06' : '5:15';
    //         case 9:
    //             return this.startingOrder === 0 ? '5:24' : '5:33';
    //         default:
    //             return '';
    //     }
    // }

    get startingHoleName(): string {
        switch (this.startingHole) {
            case 1:
                return this.startingOrder === 0 ? '4:30' : '4:39';
            case 2:
                return this.startingOrder === 0 ? '4:48' : '4:57';
            case 3:
                return this.startingOrder === 0 ? '5:06' : '5:15';
            case 4:
                return this.startingOrder === 0 ? '5:24' : '5:33';
            case 5:
                return this.startingOrder === 0 ? '5:42' : '5:51';
            case 6:
                return this.startingOrder === 0 ? '6:00' : '6:09';
            case 7:
                return this.startingOrder === 0 ? '6:18' : '6:27';
            case 8:
                return this.startingOrder === 0 ? '6:36' : '6:45';
            case 9:
                return this.startingOrder === 0 ? '6:54' : '7:03';
            default:
                return '';
        }
    }

    get canRegister(): boolean {
        return this.registrations && this.registrations.every(reg => reg.hasMember);
    }

    get paymentConfirmationDateFormatted(): string {
        if (this.paymentConfirmationDate) {
            return this.paymentConfirmationDate.format('YYYY-MM-DD h:mm:ss a');
        }
        return '';
    }

    hasExpired(): boolean {
        return this.expires.isBefore(moment());
    }

    private fromJson(json: any): any {
        const obj: {[index: string]: any} = {};
        obj.id = json.id;
        obj.eventId = json.event;
        obj.courseSetupId = json.course_setup;
        obj.registrantId = json.signed_up_by ? json.signed_up_by.id : undefined;
        obj.registrant = json.signed_up_by ? `${json.signed_up_by.first_name} ${json.signed_up_by.last_name}` : undefined;
        obj.startingHole = json.starting_hole;
        obj.startingOrder = json.starting_order;
        obj.notes = json.notes;
        obj.cardVerificationToken = json.card_verification_token;
        obj.paymentConfirmationCode = json.payment_confirmation_code;
        obj.payment = new EventPayment();
        obj.payment.total = json.payment_amount;
        if (json.payment_confirmation_timestamp) {
            obj.paymentConfirmationDate = moment(json.payment_confirmation_timestamp);
        }
        if (json.expires) {
            obj.expires = moment(json.expires);
        }
        return obj;
    }

    toJson(): any {
        return {
            id: this.id,
            event: this.eventId,
            course_setup: this.courseSetupId,
            signed_up_by: this.registrantId,
            starting_hole: this.startingHole,
            starting_order: this.startingOrder,
            notes: this.notes,
            card_verification_token: this.cardVerificationToken,
            payment_amount: this.payment.total,
            payment_confirmation_code: this.paymentConfirmationCode,
            slots: this.registrations.map(r => r.toJson())
        };
    }

    registerMember(member: PublicMember): void {
        let done = false;
        this.registrations.forEach( s => {
            if (!s.hasMember && !done) {
                member.isRegistered = true;
                s.memberId = member.id;
                s.memberName = member.name;
                s.isEventFeePaid = true;
                done = true;
            }
        });
    }

    clearRegistration(registrationId: number): void {
        this.registrations.forEach(reg => {
            if (reg.id === registrationId) {
                reg.memberId = -1;
                reg.isEventFeePaid = false;
                reg.isGrossSkinsFeePaid = false;
                reg.isNetSkinsFeePaid = false;
                reg.isGreensFeePaid = false;
                reg.isCartFeePaid = false;
                reg.totalFees = 0.0;
            }
        });
    }

    clearRegistrations(): void {
        this.registrations.forEach(reg => {
            reg.memberId = -1;
            reg.isEventFeePaid = false;
            reg.isGrossSkinsFeePaid = false;
            reg.isNetSkinsFeePaid = false;
            reg.isGreensFeePaid = false;
            reg.isCartFeePaid = false;
            reg.totalFees = 0.0;
        });
    }

    updatePayment(event: EventDetail, useAlt: Boolean = false) {
        let subtotal = 0.0;
        this.registrations.forEach(reg => {
            if (reg.hasMember) {
                let fee = useAlt ? event.eventFeeAlt : event.eventFee;
                if (reg.isGrossSkinsFeePaid) {
                    fee += event.skinsFee;
                }
                if (reg.isNetSkinsFeePaid) {
                    fee += event.skinsFee;
                }
                if (reg.isGreensFeePaid) {
                    fee += event.greensFee;
                }
                if (reg.isCartFeePaid) {
                    fee += event.cartFee;
                }
                reg.totalFees = fee;
                subtotal += fee;
            }
        });
        this.payment.update(subtotal);
    }

    copyPayment(payment: SlotPayment): void {
        this.paymentConfirmationCode = payment.paymentConfirmationCode;
        this.paymentConfirmationDate = payment.paymentConfirmationDate;
        this.payment.total = payment.paymentAmount;
    }
}
