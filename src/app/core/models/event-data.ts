import { EventDetail } from './event-detail';
import { EventRegistrationGroup } from './event-registration-group';
import { EventRegistration } from './event-registration';

// General report object for events
export class EventData {
    eventId: number;
    eventName: string;
    eventDate: string;
    groupId: number;
    paymentCode: string;
    paymentDate: string;
    course: string;
    hole: string;
    holeNumber: number;
    startingOrder: string;
    memberName: string;
    lastName: string;
    firstName: string;
    memberId: number;
    memberGhin: string;
    email: string;
    birthDate: string;
    age: string;
    isNewMember: boolean;
    isNetSignup: boolean;
    forwardTees: boolean;
    reserved: string;
    eventFee: number;
    grossSkinsFee: number;
    netSkinsFee: number;
    greenFee: number;
    cartFee: number;
    signedUpBy: string;

    get totalFees(): number {
        return this.eventFee + this.grossSkinsFee + this.netSkinsFee + this.greenFee + this.cartFee;
    }

    static create(detail: EventDetail, group: EventRegistrationGroup, reg: EventRegistration): EventData {
        let data = new EventData();
        data.eventId = detail.id;
        data.eventName = detail.name;
        data.eventDate = detail.startDate.format('YYYY-MM-DD');
        data.course = reg.courseName.replace(' League', '');
        data.hole = reg.startingHoleName;
        data.holeNumber = reg.holeNumber;
        data.startingOrder = reg.startingOrder === 0 ? 'A' : 'B';
        data.memberName = reg.memberName;
        data.memberId = reg.memberId;
        data.memberGhin = reg.memberGhin;
        data.forwardTees = reg.forwardTees;
        data.firstName = reg.memberFirstName;
        data.lastName = reg.memberLastName;
        data.email = reg.memberEmail;
        data.eventFee = reg.isEventFeePaid ? detail.eventFee : 0;
        data.grossSkinsFee = reg.isGrossSkinsFeePaid ? detail.skinsFee : 0;
        data.netSkinsFee = reg.isNetSkinsFeePaid ? detail.skinsFee : 0;
        data.greenFee = reg.isGreensFeePaid ? detail.greensFee : 0;
        data.cartFee = reg.isCartFeePaid ? detail.cartFee : 0;
        if (group && reg.memberId > 0) {
            data.groupId = group.id;
            data.paymentCode = group.paymentConfirmationCode;
            if (group.paymentConfirmationDate) {
                data.paymentDate = group.paymentConfirmationDate.format('YYYY-MM-DD');
                data.reserved = group.paymentConfirmationDate.format('YYYY-MM-DD');
            }
            data.signedUpBy = group.registrant;
        } else {
            data.paymentCode = '';
            data.paymentDate = '';
            data.reserved = '';
            data.signedUpBy = '';
        }
        return data;
    }

    static getWednesdayRegistrationHeader(): string {
        return 'Team,Course,Hole,GHIN,Tee,Last Name,First Name,Full Name,Email,Signed Up By,Sign-up Date,Payment Code,Event Fee,Gross Skins,Net Skins,Green Fees,Cart Fee,Total Fees';
    }

    getWednesdayRegistrationCsv(): string {
        return `${this.course}-${this.hole},${this.course},${this.hole},${this.memberGhin},${this.forwardTees ? 'Gold' : 'Club'},${this.lastName},${this.firstName},${this.memberName},${this.email},${this.signedUpBy},${this.reserved},${this.paymentCode},${this.eventFee},${this.grossSkinsFee},${this.netSkinsFee},${this.greenFee},${this.cartFee},${this.totalFees}`;
    }

    static getMajorRegistrationHeader(): string {
        return 'Group,GHIN,Tee,Last Name,First Name,Full Name,Email,Signed Up By,Sign-up Date,Payment Code,Event Fee,Gross Skins,Net Skins,Green Fees,Cart Fee,Total Fees';
    }

    getMajorRegistrationCsv(): string {
        return `${this.groupId},${this.memberGhin},${this.forwardTees ? 'Gold' : 'Club'},${this.lastName},${this.firstName},${this.memberName},${this.email},${this.signedUpBy},${this.reserved},${this.paymentCode},${this.eventFee},${this.grossSkinsFee},${this.netSkinsFee},${this.greenFee},${this.cartFee},${this.totalFees}`;
    }

    static getMemberRegistrationHeader(): string {
        return 'GHIN,Last Name,First Name,Full Name,Email,Birth Date,Age,Gold Tees,Sign Up Date,New Member,Payment Code,Signup Fee,Patron Card,Total Fees';
    }

    getMemberRegistrationCsv(): string {
        return `${this.memberGhin},${this.lastName},${this.firstName},${this.memberName},${this.email},${this.birthDate},${this.age},${this.forwardTees ? 1 : 0},${this.reserved},${this.isNewMember ? 1 : 0},${this.paymentCode},${this.eventFee},${this.greenFee},${this.totalFees}`;
    }

    static getMatchplayHeader(): string {
        return 'GHIN,Last Name,First Name,Full Name,Email,Gold Tees,Sign Up Date,New Member,Payment Code,Event Fee,Gross Flight,Net Flight';
    }

    getMatchplayCsv(): string {
        return `${this.memberGhin},${this.lastName},${this.firstName},${this.memberName},${this.email},${this.forwardTees ? 1 : 0},${this.reserved},${this.isNewMember ? 1 : 0},${this.paymentCode},${this.eventFee},${this.isNetSignup ? 0 : 1},${this.isNetSignup ? 1 : 0}`;
    }
}

export class EventDataSummary {

    private eventDetail: EventDetail;
    eventFees: number;
    grossSkinsFees: number;
    netSkinsFees: number;
    greenFees: number;
    cartFees: number;
    eventCount: number;
    grossSkinsCount: number;
    netSkinsCount: number;
    greenCount: number;
    cartCount: number;

    constructor(detail: EventDetail) {
        this.eventDetail = detail;
        this.eventFees = 0;
        this.grossSkinsFees = 0;
        this.netSkinsFees = 0;
        this.greenFees = 0;
        this.cartFees = 0;
        this.eventCount = 0;
        this.grossSkinsCount = 0;
        this.netSkinsCount = 0;
        this.greenCount = 0;
        this.cartCount = 0;
    }

    get totalFees() {
        return this.eventFees + this.grossSkinsFees + this.netSkinsFees + this.greenFees + this.cartFees;
    }

    update(reg: EventRegistration): void {
        this.eventFees += reg.isEventFeePaid ? this.eventDetail.eventFee : 0;
        this.grossSkinsFees += reg.isGrossSkinsFeePaid ? this.eventDetail.skinsFee : 0;
        this.netSkinsFees += reg.isNetSkinsFeePaid ? this.eventDetail.skinsFee : 0;
        this.greenFees += reg.isGreensFeePaid ? this.eventDetail.greensFee : 0;
        this.cartFees += reg.isCartFeePaid ? this.eventDetail.cartFee : 0;
        this.eventCount += reg.hasMember ? 1 : 0;
        this.grossSkinsCount += reg.isGrossSkinsFeePaid ? 1 : 0;
        this.netSkinsCount += reg.isNetSkinsFeePaid ? 1 : 0;
        this.greenCount += reg.isGreensFeePaid ? 1 : 0;
        this.cartCount += reg.isCartFeePaid ? 1 : 0;
    }

    updateByRow(row: EventData, isMatchplay: boolean = false): void {
        this.eventFees += row.eventFee;
        this.grossSkinsFees += row.grossSkinsFee;
        this.netSkinsFees += row.netSkinsFee;
        this.greenFees += row.greenFee;
        this.cartFees += row.cartFee;
        this.eventCount += 1;
        this.greenCount += row.greenFee ? 1 : 0;
        this.cartCount += row.cartFee ? 1 : 0;
        // matchplay wrinkle
        if (isMatchplay) {
            this.grossSkinsCount += row.isNetSignup ? 0 : 1;
            this.netSkinsCount += row.isNetSignup ? 1 : 0;
        } else {
            this.grossSkinsCount += row.grossSkinsFee ? 1 : 0;
            this.netSkinsCount += row.netSkinsFee ? 1 : 0;
        }
    }
}
