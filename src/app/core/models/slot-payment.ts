import {EventRegistration} from './event-registration';
import {EventDetail} from './event-detail';

import moment from 'moment';
import { isEmpty } from 'lodash';

export class SlotPayment {
    id = 0;
    slotId = 0;
    recordingMemberId = 0;
    cardVerificationToken = '';
    paymentConfirmationCode = '';
    paymentConfirmationDate: any;
    paymentAmount = 0;
    comment?: string;

    constructor(obj: any) {
        if (!isEmpty(obj)) {
            const payment = this.fromJson(obj);
            Object.assign(this, payment);
        }
    }

    private fromJson(json: any): any {
        const obj: {[index: string]: any} = {};
        obj.id = json.id;
        obj.slotId = json.registration_slot;
        obj.recordingMemberId = json.recorded_by;
        obj.cardVerificationToken = json.card_verification_token;
        obj.paymentConfirmationCode = json.payment_confirmation_code;
        obj.paymentAmount = json.payment_amount;
        obj.paymentConfirmationDate = moment(json.payment_timestamp);
        obj.comment = json.comment;
        return obj;
    }

    toJson(): any {
        // return only what the client has updated
        return {
            id: this.id,
            registration_slot: this.slotId,
            recorded_by: this.recordingMemberId,
            card_verification_token: this.cardVerificationToken,
            payment_code: this.paymentConfirmationCode,
            payment_amount: this.paymentAmount,
            comment: this.comment
        };
    }

    updatePayment(event: EventDetail, registration: EventRegistration, original: EventRegistration) {
        let fee = 0.0;
        let comment = '';
        if (!original.isEventFeePaid) {
            fee = event.eventFee;
            comment = `event registration`;
        }
        if (registration.isGrossSkinsFeePaid && !original.isGrossSkinsFeePaid) {
            fee += event.skinsFee;
            comment = comment ? ', ' : '' + `gross skins`;
        }
        if (registration.isNetSkinsFeePaid && !original.isNetSkinsFeePaid) {
            fee += event.skinsFee;
            comment = comment ? ', ' : '' + `net skins`;
        }
        registration.totalFees = fee;
        this.comment = comment;
        this.paymentAmount = fee;
        this.slotId = registration.id;
    }
}
