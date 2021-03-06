import { Component, OnInit } from '@angular/core';
import { User, AuthenticationService, AccountUpdateType } from '../../../core';
import { ToasterService } from 'angular2-toaster';
import moment from 'moment';

@Component({
    moduleId: module.id,
    templateUrl: 'account-info.component.html'
})
export class AccountInfoComponent implements OnInit {

    public user?: User;
    public birthday?: string;
    public birthdayDisplay?: string;
    public editInfo?: boolean;
    public editContact?: boolean;

    constructor(private authService: AuthenticationService, private toaster: ToasterService) { }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            this.user = user;
            if (user.member.birthDate && user.member.birthDate.isValid()) {
                this.birthday = user.member.birthDate.format('YYYY-MM-DD');
                this.birthdayDisplay = user.member.birthDate.format('MM/DD/YYYY');
            }
        });
    }

    updatePersonalInfo() {
        if (this.user) {
            if (this.birthday) {
                this.user.member.birthDate = moment(this.birthday);
                this.birthdayDisplay = this.user.member.birthDate.format('MM/DD/YYYY');
            } else {
                this.birthdayDisplay = '';
                this.user.member.birthDate = null;
            }
            this.doUpdate(AccountUpdateType.PersonalInfo);
        }
    }

    updateContactInfo() {
        this.doUpdate(AccountUpdateType.ContactInfo);
    }

    doUpdate(updateType: AccountUpdateType) {
        if (this.user) {
            const partial = this.user.partialUpdateJson(updateType);
            this.authService.updateAccount(partial).subscribe(
                () => {
                    this.editInfo = false;
                    this.editContact = false;
                    this.toaster.pop('success', 'Account Updated', 'Your changes have been saved');
                },
                (err: string) => {
                    this.toaster.pop('error', 'Account Error', err);
                }
            );
        }
    }

    canceled() {
        this.editInfo = false;
        this.editContact = false;
        this.authService.refreshUser();
    }
}
