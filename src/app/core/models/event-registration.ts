import { isEmpty } from 'lodash';

// Registration record as received from the api
export class EventRegistration {

    id = 0;
    courseName?: string;
    courseSetupId?: number;
    holeNumber?: number;
    holeId?: number;
    groupId = -1;
    memberId = 0;
    memberName = '';
    memberFirstName = '';
    memberLastName = '';
    memberGhin = '';
    memberEmail = '';
    forwardTees = false;
    startingOrder = 0;
    slotNumber = 0;
    isEventFeePaid = false;
    isGrossSkinsFeePaid = false;
    isNetSkinsFeePaid = false;
    isGreensFeePaid = false;
    isCartFeePaid = false;
    totalFees = 0;
    status = '';
    disableSkins = false;

    constructor(obj: any) {
        if (!isEmpty(obj)) {
            const reg = this.fromJson(obj);
            Object.assign(this, reg);
        }
    }

    static empty(): EventRegistration {
        const reg = new EventRegistration({
            id: undefined
        });
        return reg;
    }

    get hasMember(): boolean {
        return this.memberId > 0;
    }

    get startingHoleName(): string {
        return `${this.holeNumber}${this.startingOrder === 0 ? 'A' : 'B' }`;
    }

    get fullName(): string {
        if (this.courseName) {
            const course = this.courseName.replace('League', '').replace('9', '');
            return `${course} ${this.startingHoleName}`;
        }
        return '';
    }

    private fromJson(json: any): any {
        const obj: {[index: string]: any} = {};
        obj.id = json.id;
        obj.courseName = json.course ? json.course : 'In the Event';
        obj.courseSetupId = json.course_setup_id ? +json.course_setup_id : 0;
        obj.holeNumber = json.hole_number;
        obj.holeId = json.hole_id;
        obj.groupId = json.registration_group ? +json.registration_group : undefined;
        obj.memberId = json.member ? json.member.id : undefined;
        obj.memberName = json.member ? `${json.member.first_name} ${json.member.last_name}` : undefined;
        obj.memberFirstName = json.member ? json.member.first_name : undefined;
        obj.memberLastName = json.member ? json.member.last_name : undefined;
        obj.memberGhin = json.member ? json.member.ghin : undefined;
        obj.memberEmail = json.member ? json.member.email : undefined;
        obj.forwardTees = json.member ? json.member.forward_tees : false;
        obj.slotNumber = json.slot;
        obj.startingOrder = json.starting_order;
        // obj.isEventFeePaid = json.is_event_fee_paid;
        obj.isEventFeePaid = !!json.member; // default to true if member is present
        obj.isGrossSkinsFeePaid = json.is_gross_skins_paid;
        obj.isNetSkinsFeePaid = json.is_net_skins_paid;
        obj.isGreensFeePaid = json.is_greens_fee_paid;
        obj.isCartFeePaid = json.is_cart_fee_paid;
        obj.status = json.status;

        return obj;
    }

    toJson(): any {
        if (this.memberId) {
            return {
                id: this.id,
                registration_group: this.groupId,
                member: {
                    id: this.memberId,
                    first_name: this.memberFirstName,
                    last_name: this.memberLastName,
                    email: this.memberEmail,
                    ghin: this.memberGhin,
                    forward_tees: this.forwardTees
                },
                is_event_fee_paid: this.isEventFeePaid,
                is_gross_skins_paid: this.isGrossSkinsFeePaid,
                is_net_skins_paid: this.isNetSkinsFeePaid,
                is_greens_fee_paid: this.isGreensFeePaid,
                is_cart_fee_paid: this.isCartFeePaid,
                status: this.status
            };
        } else {
            return {
                id: this.id,
                registration_group: this.groupId,
                member: 0,
                is_event_fee_paid: this.isEventFeePaid,
                is_gross_skins_paid: this.isGrossSkinsFeePaid,
                is_net_skins_paid: this.isNetSkinsFeePaid,
                is_greens_fee_paid: this.isGreensFeePaid,
                is_cart_fee_paid: this.isCartFeePaid,
                status: this.status
            };
        }
    }
}
