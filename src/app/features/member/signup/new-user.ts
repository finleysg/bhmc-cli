import { User } from '../../../core';
import * as moment from 'moment';

export class NewUser {

    username: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    phoneNumber: string;
    email: string;
    password1: string;
    password2: string;
    forwardTees: boolean;
    noHandicap: boolean;
    ghin: string;
    formerClubName: string;
    formerClubNumber: string;
    address: string;
    city: string;
    state: string;
    zip: string;

    toUser(): User {
        const u = new User();
        u.username = this.username;
        u.firstName = this.firstName;
        u.lastName = this.lastName;
        u.email = this.email;
        u.member.birthDate = moment(this.birthDate);
        u.member.phoneNumber = this.phoneNumber;
        u.member.forwardTees = this.forwardTees;
        u.member.ghin = this.ghin;
        u.member.address = this.address;
        u.member.city = this.city;
        u.member.state = this.state;
        u.member.zipCode = this.zip;
        return u;
    }
}
