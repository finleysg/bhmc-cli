import { Component, OnInit, ViewChild } from '@angular/core';
import { User, AuthenticationService, EventDetail, RegistrationService,
    EventDetailService, EventRegistrationGroup, EventDocument, DocumentType } from '../../../core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentComponent } from '../../../shared/payments/payment.component';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';

@Component({
    moduleId: module.id,
    templateUrl: 'matchplay-signup.component.html',
})
export class MatchPlaySignupComponent implements OnInit {

    @ViewChild(PaymentComponent) paymentComponent: PaymentComponent;

    public registrationGroup: EventRegistrationGroup;
    public paymentGroup: EventRegistrationGroup;
    public eventDetail: EventDetail;
    public currentUser: User;
    public application: EventDocument;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private eventService: EventDetailService,
        private registrationService: RegistrationService,
        private toaster: ToasterService,
        private authService: AuthenticationService) { }

    ngOnInit(): void {
        this.currentUser = this.authService.user;
        this.route.data
            .subscribe((data: { eventDetail: EventDetail }) => {
                this.eventDetail = data.eventDetail;
                this.application = this.eventDetail.getDocument(DocumentType.SignUp);
                this.registrationGroup = EventRegistrationGroup.create(this.currentUser);
                this.updatePayment();
            });
    }

    updatePayment() {
        this.registrationGroup.updatePayment(this.eventDetail);
    }

    toggleBracket(bracket: string) {
        if (bracket === 'scratch') {
            this.registrationGroup.registrations[0].isNetSkinsFeePaid = !this.registrationGroup.registrations[0].isGrossSkinsFeePaid;
        } else {
            this.registrationGroup.registrations[0].isGrossSkinsFeePaid = !this.registrationGroup.registrations[0].isNetSkinsFeePaid;
        }
    }

    registerOnline(): void {
        if (!this.registrationGroup.registrations[0].isNetSkinsFeePaid && !this.registrationGroup.registrations[0].isGrossSkinsFeePaid) {
            this.toaster.pop('warning', 'Invalid', 'Select the scratch or flighted bracket.');
            return;
        }
        this.registrationService.reserve(this.eventDetail.id)
            .then(() => {
                // preserve the registration choices made
                let group = this.registrationService.currentGroup;
                let registration = _.merge({}, group.registrations[0], this.registrationGroup.registrations[0]);
                this.paymentGroup = _.merge({}, group, this.registrationGroup);
                this.paymentGroup.registrations[0] = registration;
                this.updatePayment();
                this.paymentComponent.open();
            })
            .catch((err: string) => {
                this.toaster.pop('error', 'Error', err);
            });
    }

    paymentComplete(result: boolean): void {
        if (result) {
            this.eventService.refreshEventDetail()
                .then(() => {
                    this.authService.refreshUser();
                    this.router.navigate(['registered'], { relativeTo: this.route.parent });
                })
                .catch((err: string) => {
                    this.toaster.pop('error', 'Error', err);
                })
        } else {
            this.registrationService.cancelReservation(this.paymentGroup);
        }
    }
}
