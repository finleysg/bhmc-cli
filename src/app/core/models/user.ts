import { PrivateMember } from './member';
import { isEmpty } from 'lodash';

export enum AccountUpdateType {
    PersonalInfo,
    ContactInfo,
    Username,
    ForwardTees,
    PaymentInfo
}

export class User {

    id = 0;
    username = '';
    firstName = '';
    lastName = '';
    email = '';
    member = new PrivateMember({});
    isAuthenticated = false;
    isStaff = false;
    isActive = false;
    groups?: any[];

    constructor(obj: any) {
        if (!isEmpty(obj)) {
            const user = this.fromJson(obj);
            Object.assign(this, user);
        }
    }

    get name(): string {
        if (!this.isAuthenticated) {
            return 'Guest';
        }
        return this.firstName + ' ' + this.lastName;
    }

    get isBoardMember(): boolean {
        if (this.groups && this.groups.length > 0) {
            return this.groups.some(g => g.name === 'Board Member');
        }
        return false;
    }

    get isProshopStaff(): boolean {
        if (this.groups && this.groups.length > 0) {
            return this.groups.some(g => g.name === 'Proshop Staff');
        }
        return false;
    }

    get isOfficer(): boolean {
        if (this.groups && this.groups.length > 0) {
            return this.groups.some(g => g.name === 'Officer');
        }
        return false;
    }

    private fromJson(json: any): any {
        const obj: {[index: string]: any} = {};
        obj.id = json.id;
        obj.username = json.username;
        obj.firstName = json.first_name;
        obj.lastName = json.last_name;
        obj.email = json.email;
        obj.isAuthenticated = json.is_authenticated;
        obj.isStaff = json.is_staff;
        obj.isActive = json.is_active;
        obj.groups = json.groups;
        obj.member = new PrivateMember(json.member);
        return obj;
    }

    // used only to create new accounts
    toJson(password: string): any {
        return {
            'username': this.username,
            'email': this.email,
            'password': password,
            'first_name': this.firstName,
            'last_name': this.lastName,
            'groups': [],
            'member': this.member.toJson()
        };
    }

    partialUpdateJson(updateType: AccountUpdateType): any {
        switch (updateType) {
            case AccountUpdateType.PersonalInfo:
                return {
                    'first_name': this.firstName,
                    'last_name': this.lastName,
                    'member': {
                        'birth_date': this.member.birthDate ? this.member.birthDate.format('YYYY-MM-DD') : null,
                        'address1': this.member.address,
                        'city': this.member.city,
                        'state': this.member.state,
                        'zip': this.member.zipCode
                    }
                };
            case AccountUpdateType.ContactInfo:
                return {
                    'email': this.email,
                    'member': {
                        'phone_number': this.member.phoneNumber
                    }
                };
            case AccountUpdateType.Username:
                return {
                    'username': this.username,
                    'member': { }
                };
            case AccountUpdateType.ForwardTees:
                return {
                    'member': {
                        'forward_tees': this.member.forwardTees
                    }
                };
            case AccountUpdateType.PaymentInfo:
                return {
                    'member': {
                        'save_last_card': this.member.saveLastCard
                    }
                };
            default:
                return {};
        }
    }
}
