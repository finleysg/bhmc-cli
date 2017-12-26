import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { SavedCard, User, AuthenticationService, AccountUpdateType, MemberService } from '../../../core';

@Component({
    moduleId: module.id,
    templateUrl: 'account-settings.component.html',
    styleUrls: ['account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

    public savedCard: SavedCard;
    public user: User;
    public editIdentity: boolean;
    public editPaymentInfo: boolean;

    constructor(private authService: AuthenticationService,
                private memberService: MemberService,
                private toaster: ToasterService,
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

    updatePaymentInfo(): void {
        this.doUpdate(AccountUpdateType.PaymentInfo);
    }
    
    doUpdate(updateType: AccountUpdateType): void {
        let partial = this.user.partialUpdateJson(updateType);
        this.authService.updateAccount(partial).subscribe(
            () => {
                if (this.editIdentity) {
                    this.editIdentity = false;
                    this.toaster.pop('success', 'Account Updated', 'Your username have been changed');
                } else if (this.editPaymentInfo) {
                    this.memberService.stripeSavedCard().subscribe(card => this.savedCard = card);
                    this.editPaymentInfo = false;
                    this.toaster.pop('success', 'Account Updated', 'Your payment preferences have been updated');
                }
            },
            (err: string) => {
                this.toaster.pop('error', 'Account Error', err);
            }
        );
    }

    changePassword(): void {
        this.router.navigate(['change-password'], {relativeTo: this.route.parent});
    }

    canceled(): void {
        this.editIdentity = false;
        this.editPaymentInfo = false;
        this.authService.refreshUser();
    }
}
