import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { SavedCard, User, AuthenticationService, AccountUpdateType, MemberService } from '../../../core';
import { SavedCardComponent } from '../../../shared/payments/saved-card.component';

@Component({
    moduleId: module.id,
    templateUrl: 'account-settings.component.html',
    styleUrls: ['account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

    @ViewChild(SavedCardComponent) cardModal: SavedCardComponent;
    public savedCard: SavedCard;
    public user: User;
    public editIdentity: boolean;
    public editPaymentInfo: boolean;
    private cardIsSaved: boolean;

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
                this.cardIsSaved = this.savedCard.last4 && this.savedCard.last4.length === 4;
            });
    }

    updateCard(): void {
        this.cardModal.open();
    }

    cardSaved(saved: boolean): void {
        if (!this.cardIsSaved) {
            this.cardIsSaved = saved;
        }
    }

    updateIdentity(): void {
        this.doUpdate(AccountUpdateType.Username);
    }

    updatePaymentInfo(): void {
        if (this.user.member.saveLastCard && !this.cardIsSaved) {
            this.toaster.pop('error', 'Card Required', 'You will need to add a credit card first (Update Card button)');
        } else {
            this.doUpdate(AccountUpdateType.PaymentInfo);
        }
    }

    doUpdate(updateType: AccountUpdateType): void {
        const partial = this.user.partialUpdateJson(updateType);
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
