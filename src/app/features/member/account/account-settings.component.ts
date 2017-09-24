import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { DialogService, SavedCard, User, AuthenticationService, AccountUpdateType } from '../../../core';

@Component({
    moduleId: module.id,
    templateUrl: 'account-settings.component.html',
    styleUrls: ['account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

    public savedCard: SavedCard;
    public user: User;
    public editIdentity: boolean;

    constructor(private authService: AuthenticationService,
                private toaster: ToasterService,
                private dialog: DialogService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => this.user = user);
        this.route.data
            .subscribe((data: { savedCard: SavedCard }) => {
                this.savedCard = data.savedCard;
            });
    }

    updateIdentity(): void {
        this.doUpdate(AccountUpdateType.Username);
    }

    doUpdate(updateType: AccountUpdateType): void {
        let partial = this.user.partialUpdateJson(updateType);
        this.authService.updateAccount(partial)
            .then(() => {
                this.editIdentity = false;
                this.toaster.pop('success', 'Account Updated', 'Your username have been changed');
            })
            .catch((err: string) => {
                this.toaster.pop('error', 'Account Error', err);
            });
    }

    changePassword(): void {
        this.router.navigate(['change-password'], {relativeTo: this.route.parent});
    }

    openPaymentReport(): void {
        this.dialog.info('Coming Soon', `This button will pull all your payments for the current season from Stripe. It
                                         will allow you to check for yourself if you have a doubt about whether or not
                                         a payment went through.`);
    }

    canceled(): void {
        this.editIdentity = false;
        this.authService.refreshUser();
    }
}
