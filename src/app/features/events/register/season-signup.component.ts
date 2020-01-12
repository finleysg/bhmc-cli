import { Component, OnInit, ViewChild } from '@angular/core';
import { User, AuthenticationService, EventDetail, RegistrationService,
    EventDetailService, EventRegistrationGroup, EventDocument, DocumentType } from '../../../core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentComponent } from '../../../shared/payments/payment.component';
import { ToasterService } from 'angular2-toaster';
import { ConfigService } from '../../../app-config.service';
import { AppConfig } from '../../../app-config';
import { tap, catchError } from 'rxjs/operators';
import { empty } from 'rxjs';
import { merge } from 'lodash';

@Component({
    moduleId: module.id,
    templateUrl: 'season-signup.component.html',
})
export class SeasonSignupComponent implements OnInit {

    @ViewChild(PaymentComponent, { static: false }) paymentComponent?: PaymentComponent;

    public registrationGroup: EventRegistrationGroup = new EventRegistrationGroup({});
    public paymentGroup?: EventRegistrationGroup;
    public eventDetail: EventDetail = new EventDetail({});
    public currentUser: User;
    public config: AppConfig;
    public application?: EventDocument;
    public forwardTees = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private registrationService: RegistrationService,
        private eventService: EventDetailService,
        private configService: ConfigService,
        private toaster: ToasterService,
        private authService: AuthenticationService) {

        this.currentUser = this.authService.user;
        this.config = this.configService.config;
    }

    ngOnInit(): void {
        this.route.data
            .subscribe(data => {
                if (data.eventDetail instanceof EventDetail) {
                    this.eventDetail = data.eventDetail;
                    const signupDocs = this.eventDetail.getDocuments(DocumentType.SignUp);
                    if (signupDocs) {
                        signupDocs.forEach(d => {  // TODO: better way to distinguish between the 2 signup docs
                            if (d.title === 'Returning Member Application') {
                                this.application = d;
                            }
                        });
                    }
                    this.registrationGroup = EventRegistrationGroup.create(this.currentUser);
                    this.updatePayment();
                }
            });
    }

    updatePayment() {
        this.registrationGroup.updatePayment(this.eventDetail);
    }

    toggleNotes() {
        if (this.forwardTees) {
            // tslint:disable-next-line:max-line-length
            this.registrationGroup.notes = this.registrationGroup.notes ? 'PLAYING FORWARD TEES\n' + this.registrationGroup.notes : 'PLAYING FORWARD TEES';
        } else {
            if (this.registrationGroup.notes) {
                this.registrationGroup.notes = this.registrationGroup.notes.replace('PLAYING FORWARD TEES', '');
            }
        }
    }

    registerOnline(): void {
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
            catchError(err => {
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
                catchError(err => {
                    this.toaster.pop('error', 'Error', err);
                    return empty();
                })
            ).subscribe();
        } else {
            if (this.paymentGroup) {
                this.registrationService.cancelReservation(this.paymentGroup).subscribe();
            }
        }
    }
}
