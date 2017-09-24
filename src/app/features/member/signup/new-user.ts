import { User } from '../../../core';
declare const moment: any;

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
    ghin: string;
    formerClubName: string;
    formerClubNumber: string;

    toUser(): User {
        let u = new User();
        u.username = this.username;
        u.firstName = this.firstName;
        u.lastName = this.lastName;
        u.email = this.email;
        u.member.birthDate = moment(this.birthDate);
        u.member.phoneNumber = this.phoneNumber;
        u.member.forwardTees = this.forwardTees;
        u.member.ghin = this.ghin;
        return u;
    }
}
