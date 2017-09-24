import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService, EventDocument, DocumentType, EventPayment, RegistrationService, User,
    EventRegistrationGroup, EventDetail } from '../../../core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { PaymentComponent } from '../../../shared/payments/payment.component';
import { ConfigService } from '../../../app-config.service';
import { AppConfig } from '../../../app-config';
import { FormGroup } from '@angular/forms';
import { NewUser } from './new-user';
import { NewMemberForm } from './new-member-form.service';

@Component({
    moduleId: module.id,
    templateUrl: 'new-member-signup.component.html',
    styleUrls: ['new-member-signup.component.css']
})
export class NewMemberSignupComponent implements OnInit {

    @ViewChild(PaymentComponent) paymentComponent: PaymentComponent;

    public newUser: NewUser;
    public userForm: FormGroup;
    public fieldErrors: any;
    public eventDetail: EventDetail;
    public group: EventRegistrationGroup;
    public paymentCalc: EventPayment;
    public application: EventDocument;
    public config: AppConfig;
    public loading: boolean;
    public registered: boolean;

    constructor(
        private authService: AuthenticationService,
        private toaster: ToasterService,
        private route: ActivatedRoute,
        private router: Router,
        private registrationService: RegistrationService,
        private formService: NewMemberForm,
        private configService: ConfigService) {
    }

    ngOnInit(): void {
        this.newUser = new NewUser();
        this.config = this.configService.config;
        this.formService.form$.subscribe(form => this.userForm = form);
        this.formService.errors$.subscribe(errors => this.fieldErrors = errors);
        this.route.data
            .subscribe((data: { eventDetail: EventDetail }) => {
                this.eventDetail = data.eventDetail;
                this.paymentCalc = new EventPayment();
                this.paymentCalc.update(this.eventDetail.eventFeeAlt);
                let signupDocs = this.eventDetail.getDocuments(DocumentType.SignUp);
                if (signupDocs) {
                    signupDocs.forEach(d => {  // TODO: better way to distinguish between the 2 signup docs
                        if (d.title === 'New Member Application') {
                            this.application = d;
                        }
                    })
                }
            });
        this.group = EventRegistrationGroup.create(new User());
        this.formService.buildForm(this.newUser);
    }

    createAccount(): void {
        // TODO: BUG: createAccount is getting called a second time
        if (this.loading) {
            return;
        }
        this.loading = true;

        this.formService.updateValue(this.newUser);
        setTimeout(() => {
            this.authService.createAccount(this.newUser.toUser().toJson(this.newUser.password1))
                .then(() => {
                    this.toaster.pop('info', 'Account Created', 'Step 1 complete: your account has been created');
                    return this.authService.quietLogin(this.newUser.username, this.newUser.password1)
                })
                .then(() => {
                    return this.registrationService.reserve(this.eventDetail.id);
                })
                .then(() => {
                    this.group = this.registrationService.currentGroup;
                    this.group.notes = 'NEW MEMBER REGISTRATION';
                    if (this.newUser.formerClubName) {
                        this.group.notes = this.group.notes + `\nFormer club: ${this.newUser.formerClubName} (${this.newUser.formerClubNumber})`;
                    }
                    if (this.newUser.forwardTees) {
                        this.group.notes = this.group.notes + 'PLAYING FORWARD TEES';
                    }
                    this.group.updatePayment(this.eventDetail, true);
                    this.paymentComponent.open();
                })
                .catch((err: any) => {
                    this.loading = false;
                    this.toaster.pop('error', 'Account Creation Error', err);
                })
        }, 1000);
    }

    done(result: boolean): void {
        // remove any temporary auth token - user must log in
        if (result) {
            this.authService.resetUser();
            this.registered = true;
        } else {
            this.registrationService.cancelReservation(this.group)
                .then(() => {
                    this.authService.resetUser();
                    this.router.navigate(['/home']);
                });
        }
    }
}
