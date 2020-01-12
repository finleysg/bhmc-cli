import { Component, OnInit, ViewChild } from '@angular/core';
import { User, AuthenticationService, EventDetail, RegistrationService,
    EventDetailService, EventRegistrationGroup, EventDocument, DocumentType } from '../../../core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentComponent } from '../../../shared/payments/payment.component';
import { ToasterService } from 'angular2-toaster';
import { tap, catchError } from 'rxjs/operators';
import { empty } from 'rxjs';
import { merge } from 'lodash';

@Component({
    moduleId: module.id,
    templateUrl: 'matchplay-signup.component.html',
})
export class MatchPlaySignupComponent implements OnInit {

    @ViewChild(PaymentComponent, { static: false }) paymentComponent?: PaymentComponent;

    public registrationGroup: EventRegistrationGroup = new EventRegistrationGroup({});
    public paymentGroup?: EventRegistrationGroup;
    public eventDetail: EventDetail = new EventDetail({});
    public currentUser: User;
    public application?: EventDocument;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private eventService: EventDetailService,
        private registrationService: RegistrationService,
        private toaster: ToasterService,
        private authService: AuthenticationService) {

        this.currentUser = this.authService.user;
    }

    ngOnInit(): void {
        this.route.data
            .subscribe(data => {
                if (data.eventDetail instanceof EventDetail) {
                    this.eventDetail = data.eventDetail;
                    this.application = this.eventDetail.getDocument(DocumentType.SignUp);
                    this.registrationGroup = EventRegistrationGroup.create(this.currentUser);
                    this.updatePayment();
                }
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
        this.registrationService.reserve(this.eventDetail.id).pipe(
            tap(() => {
                // preserve the registration choices made
                const group = this.registrationService.currentGroup;
                const registration = merge({}, group.registrations[0], this.registrationGroup.registrations[0]);
                this.paymentGroup = merge({}, group, this.registrationGroup);
                this.paymentGroup.registrations[0] = registration;
                this.updatePayment();
                if (this.paymentComponent) {
                    this.paymentComponent.open();
                }
            }),
            catchError((err: string) => {
                this.toaster.pop('error', 'Error', err);
                return empty();
            })
        ).subscribe();
    }

    paymentComplete(result: boolean): void {
        if (result) {
            this.eventService.refreshEventDetail().pipe(
                tap(() => {
                    this.authService.refreshUser();
                    this.router.navigate(['registered'], { relativeTo: this.route.parent });
                }),
                catchError((err: string) => {
                    this.toaster.pop('error', 'Error', err);
                    return empty();
                })
            ).subscribe();
        } else {
            if (this.paymentGroup) {
                this.registrationService.cancelReservation(this.paymentGroup);
            }
        }
    }
}
