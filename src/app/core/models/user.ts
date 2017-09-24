import { PrivateMember } from './member';

export enum AccountUpdateType {
    PersonalInfo,
    ContactInfo,
    Username,
    ForwardTees
}

export class User {

    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    member: PrivateMember;
    isAuthenticated: boolean = false;
    isStaff: boolean = false;
    isActive: boolean = false;
    groups: any[];

    constructor() {
        this.member = new PrivateMember();
    }

    get name(): string {
        if (!this.isAuthenticated) {
            return 'Guest';
        }
        return this.firstName + ' ' + this.lastName;
    };

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

    fromJson(json: any): User {
        if (json) {
            this.id = json.id;
            this.username = json.username;
            this.firstName = json.first_name;
            this.lastName = json.last_name;
            this.email = json.email;
            this.isAuthenticated = json.is_authenticated;
            this.isStaff = json.is_staff;
            this.isActive = json.is_active;
            this.groups = json.groups;
            this.member = new PrivateMember().fromJson(json.member);
        }
        return this;
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
                        'city': this.member.location
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
            default:
                return {}
        }
    }
}
