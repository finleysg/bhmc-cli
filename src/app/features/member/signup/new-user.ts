import { User } from '../../../core';
import * as moment from 'moment';

export class NewUser {

    username = '';
    firstName = '';
    lastName = '';
    birthDate?: string;
    phoneNumber?: string;
    email = '';
    password1 = '';
    password2 = '';
    forwardTees = false;
    noHandicap = false;
    ghin?: string;
    formerClubName?: string;
    formerClubNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;

    toUser(): User {
        const u = new User({});
        u.username = this.username;
        u.firstName = this.firstName;
        u.lastName = this.lastName;
        u.email = this.email;
        u.member.birthDate = moment(this.birthDate);
        u.member.phoneNumber = this.phoneNumber;
        u.member.forwardTees = this.forwardTees;
        u.member.ghin = this.ghin || '';
        u.member.address = this.address;
        u.member.city = this.city;
        u.member.state = this.state;
        u.member.zipCode = this.zip;
        return u;
    }
}
