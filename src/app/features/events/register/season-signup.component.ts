import { Component, OnInit, ViewChild } from '@angular/core';
import { User, AuthenticationService, EventDetail, RegistrationService,
    EventDetailService, EventRegistrationGroup, EventDocument, DocumentType } from '../../../core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentComponent } from '../../../shared/payments/payment.component';
import { ToasterService } from 'angular2-toaster';
import { ConfigService } from '../../../app-config.service';
import { AppConfig } from '../../../app-config';
import * as _ from 'lodash';

@Component({
    moduleId: module.id,
    templateUrl: 'season-signup.component.html',
})
export class SeasonSignupComponent implements OnInit {

    @ViewChild(PaymentComponent) paymentComponent: PaymentComponent;

    public registrationGroup: EventRegistrationGroup;
    public paymentGroup: EventRegistrationGroup;
    public eventDetail: EventDetail;
    public currentUser: User;
    public config: AppConfig;
    public application: EventDocument;
    public forwardTees: boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private registrationService: RegistrationService,
        private eventService: EventDetailService,
        private configService: ConfigService,
        private toaster: ToasterService,
        private authService: AuthenticationService) { }

    ngOnInit(): void {
        this.currentUser = this.authService.user;
        this.config = this.configService.config;
        this.route.data
            .subscribe((data: { eventDetail: EventDetail }) => {
                this.eventDetail = data.eventDetail;
                let signupDocs = this.eventDetail.getDocuments(DocumentType.SignUp);
                if (signupDocs) {
                    signupDocs.forEach(d => {  // TODO: better way to distinguish between the 2 signup docs
                        if (d.title === 'Returning Member Application') {
                            this.application = d;
                        }
                    })
                }
                this.registrationGroup = EventRegistrationGroup.create(this.currentUser);
                this.updatePayment();
            });
    }

    updatePayment() {
        this.registrationGroup.updatePayment(this.eventDetail);
    }

    toggleNotes() {
        if (this.forwardTees) {
            this.registrationGroup.notes = this.registrationGroup.notes ? 'PLAYING FORWARD TEES\n' + this.registrationGroup.notes : 'PLAYING FORWARD TEES';
        } else {
            if (this.registrationGroup.notes) {
                this.registrationGroup.notes = this.registrationGroup.notes.replace('PLAYING FORWARD TEES', '');
            }
        }
    }

    registerOnline(): void {
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
            .catch(err => {
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
                .catch(err => {
                    this.toaster.pop('error', 'Error', err);
                });
        } else {
            this.registrationService.cancelReservation(this.paymentGroup);
        }
    }
}
