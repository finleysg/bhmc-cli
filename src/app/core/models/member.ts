import moment from 'moment';
import { isEmpty } from 'lodash';

export class PublicMember {
    id = 0;
    ghin = '';
    firstName = '';
    lastName = '';
    email = '';
    birthDate: any;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phoneNumber?: string;
    forwardTees = false;
    isActive = false;
    signupDate: any;
    isFriend = false; // only in client
    isRegistered = false; // only in client
    formerClub = ''; // derived from reg group in new member report

    constructor(obj: any) {
        if (!isEmpty(obj)) {
            const member = this.fromJson(obj);
            Object.assign(this, member);
        }
    }

    static getCsvHeader(): string {
        return 'ID,Last Name,First Name,Email,Birth Date,Age,Gold Tees,Is Active,Date Joined';
    }

    get name(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    get age(): number {
        if (moment(this.birthDate).isValid()) {
            return moment().diff(this.birthDate, 'years');
        }
        return 0;
    }

    get ageFormatted(): string {
        if (moment(this.birthDate).isValid()) {
            return moment().diff(this.birthDate, 'years').toString();
        }
        return '';
    }

    get birthDateFormatted(): string {
        if (moment(this.birthDate).isValid()) {
            return this.birthDate.format('YYYY-MM-DD');
        }
        return '';
    }

    get signupDateFormatted(): string {
        if (moment(this.signupDate).isValid()) {
            return this.signupDate.format('YYYY-MM-DD');
        }
        return '';
    }

    private fromJson(json: any): any {
        const obj: {[index: string]: any} = {};
        obj.id = json.id;
        obj.ghin = json.ghin;
        obj.firstName = json.first_name;
        obj.lastName = json.last_name;
        obj.email = json.email;
        obj.birthDate = moment(json.birth_date);
        obj.signupDate = moment(json.date_joined);
        obj.city = json.city;
        obj.phoneNumber = json.phone_number;
        obj.forwardTees = json.forward_tees;
        obj.isActive = json.is_active;
        obj.address = json.address1;
        obj.city = json.city;
        obj.state = json.state;
        obj.zipCode = json.zip;
        return obj;
    }

    getCsvData(): string {
        // tslint:disable-next-line:max-line-length
        return `${this.ghin},${this.lastName},${this.firstName},${this.email},${this.birthDateFormatted},${this.ageFormatted},${this.forwardTees ? 1 : 0},${this.isActive ? 1 : 0},${this.signupDateFormatted}`;
    }
}

export class PrivateMember {
    id = 0;
    birthDate: any;
    ghin = '';
    handicap = 0;
    handicapRevisionDate?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    stripeCustomerId?: string;
    saveLastCard = false;
    forwardTees = false;
    membershipIsCurrent = false;
    matchplayParticipant = false;

    constructor(obj: any) {
        if (!isEmpty(obj)) {
            const member = this.fromJson(obj);
            Object.assign(this, member);
        }
    }

    private fromJson(json: any): any {
        const obj: {[index: string]: any} = {};
        obj.id = json.id;
        obj.birthDate = moment(json.birth_date);
        obj.city = json.city;
        obj.phoneNumber = json.phone_number;
        obj.ghin = json.ghin;
        obj.handicap = json.handicap;
        obj.handicapRevisionDate = json.handicap_revision_date;
        obj.stripeCustomerId = json.stripe_customer_id;
        obj.saveLastCard = json.save_last_card;
        obj.forwardTees = json.forward_tees;
        obj.address = json.address1;
        obj.state = json.state;
        obj.zipCode = json.zip;
        return obj;
    }

    // used only for new account creation
    toJson(): any {
        return {
            'address1': this.address,
            'city': this.city,
            'state': this.state,
            'zip': this.zipCode,
            'birth_date': this.birthDate.format('YYYY-MM-DD'),
            'phone_number': this.phoneNumber,
            'ghin': this.ghin,
            'forward_tees': this.forwardTees
        };
    }
}
