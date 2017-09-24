// Registration record as received from the api
export class EventRegistration {

    id: number;
    courseName: string;
    courseSetupId: number;
    holeNumber: number;
    holeId: number;
    groupId: number;
    memberId: number;
    memberName: string;
    memberFirstName: string;
    memberLastName: string;
    memberGhin: string;
    memberEmail: string;
    forwardTees: boolean;
    startingOrder: number;
    slotNumber: number;
    isEventFeePaid: boolean;
    isGrossSkinsFeePaid: boolean;
    isNetSkinsFeePaid: boolean;
    isGreensFeePaid: boolean;
    isCartFeePaid: boolean;
    totalFees: number;
    status: string;

    get hasMember(): boolean {
        return this.memberId > 0;
    }

    get startingHoleName(): string {
        return `${this.holeNumber}${this.startingOrder === 0 ? 'A' : 'B' }`;
    }

    fromJson(json: any): EventRegistration {
        this.id = json.id;
        this.courseName = json.course ? json.course : 'In the Event';
        this.courseSetupId = json.course_setup_id ? +json.course_setup_id : 0;
        this.holeNumber = json.hole_number;
        this.holeId = json.hole_id;
        this.groupId = json.registration_group ? +json.registration_group : -1;
        this.memberId = json.member ? json.member.id : -1;
        this.memberName = json.member ? `${json.member.first_name} ${json.member.last_name}` : '';
        this.memberFirstName = json.member ? json.member.first_name : '';
        this.memberLastName = json.member ? json.member.last_name : '';
        this.memberGhin = json.member ? json.member.ghin : '';
        this.memberEmail = json.member ? json.member.email : '';
        this.forwardTees = json.member ? json.member.forward_tees : false;
        this.slotNumber = json.slot;
        this.startingOrder = json.starting_order;
        this.isEventFeePaid = !!json.member; // default to true if member is present
        this.isGrossSkinsFeePaid = json.is_gross_skins_paid;
        this.isNetSkinsFeePaid = json.is_net_skins_paid;
        this.isGreensFeePaid = json.is_greens_fee_paid;
        this.isCartFeePaid = json.is_cart_fee_paid;
        this.status = json.status;

        return this;
    }

    toJson(): any {
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
    }
}
