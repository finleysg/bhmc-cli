import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { AuthenticationService, EventDocument, DocumentType, EventPayment, RegistrationService, User,
    EventRegistrationGroup, EventDetail } from '../../../core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { PaymentComponent } from '../../../shared/payments/payment.component';
import { ConfigService } from '../../../app-config.service';
import { AppConfig } from '../../../app-config';
import { NewUser } from './new-user';
import { map, flatMap } from 'rxjs/operators';
import { SignupService, SignupStepsEnum } from './signup.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
    templateUrl: 'new-member-signup.component.html',
    styleUrls: ['new-member-signup.component.css'],
    animations: [
        trigger('stepTransition', [
            state('previous', style({transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden'})),
            state('current', style({transform: 'none', visibility: 'visible'})),
            state('next', style({transform: 'translate3d(100%, 0, 0)', visibility: 'hidden'})),
            transition('* => *', animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'))
        ])
    ]
})
export class NewMemberSignupComponent implements OnInit {

    @ViewChild(PaymentComponent) paymentComponent: PaymentComponent;

    public steps: number[];
    public currentStep: SignupStepsEnum = SignupStepsEnum.NotStarted;
    public newUser: NewUser;
    public fieldErrors: string[];
    public eventDetail: EventDetail;
    public group: EventRegistrationGroup;
    public paymentCalc: EventPayment;
    public application: EventDocument;
    public config: AppConfig;
    public includePatronCard = true;
    public registered: boolean;

    constructor(
        private authService: AuthenticationService,
        private toaster: ToasterService,
        private route: ActivatedRoute,
        private location: Location, 
        private registrationService: RegistrationService,
        private signupService: SignupService,
        private configService: ConfigService) {
    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.signupService.init();
        this.signupService.errors$.subscribe(errors => this.fieldErrors = errors);
        this.signupService.currentState.subscribe(st => {
            this.steps = st.steps;
            this.currentStep = st.currentStep;
            this.newUser = st.userDetail;
            // cannot continue online registration
            if (st.emailExists) {
                this.currentStep = 98;
            }
            if (st.ghinExists) {
                this.currentStep = 99;
            }
        });
        this.route.data
            .subscribe((data: { eventDetail: EventDetail }) => {
                this.eventDetail = data.eventDetail;
                this.paymentCalc = new EventPayment();
                this.paymentCalc.update(this.eventDetail.eventFeeAlt + this.eventDetail.greensFee);
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
    }

    startSignup(): void {
        this.signupService.startSignup();
    }

    cancelSignup(): void {
        this.signupService.init();
    }

    quitSignup(): void {
        this.signupService.init();
        this.location.back();
    }

    nextStep(step: number): void {
        switch (step) {
            case 2:
                this.signupService.validateEmail(this.newUser.email);
                break;
            case 3:
                this.signupService.validateNameAndBirthdate(this.newUser.firstName, this.newUser.lastName, this.newUser.birthDate);
                break;
            case 4:
                this.signupService.validateGhin(this.newUser.ghin, this.newUser.formerClubName);
                break;
            case 5:
                this.signupService.validateTeePreference(this.newUser.forwardTees);
                break;
            case 6:
                this.signupService.validateCredentials(this.newUser.username, this.newUser.password1, this.newUser.password2);
                break;
            case 7:
                this.register().then((isValid: boolean) => {
                    if (isValid) {
                        this.group = this.registrationService.currentGroup;
                        this.group.registrations[0].isGreensFeePaid = this.includePatronCard; // greens fee holds patron fee in this case
                        this.group.notes = 'NEW MEMBER REGISTRATION';
                        if (this.newUser.formerClubName) {
                            this.group.notes = this.group.notes + `\nFormer club: ${this.newUser.formerClubName}`;
                        }
                        if (this.newUser.forwardTees) {
                            this.group.notes = this.group.notes + 'PLAYING FORWARD TEES';
                        }
                        this.group.updatePayment(this.eventDetail, true);
                        this.paymentComponent.open();
                    }
                }).catch((err: any) => {
                    this.toaster.pop('error', 'Account Creation Error', err);
                });
                break;
        }
    }

    prevStep(step: number): void {
        this.signupService.clearErrors();
        this.currentStep = step;
    }

    register(): Promise<boolean> {
        return this.authService.createAccount(this.newUser.toUser().toJson(this.newUser.password1)).pipe(
            flatMap(() => {
                this.toaster.pop('info', 'Account Created', 'Your account has been created');
                return this.authService.quietLogin(this.newUser.username, this.newUser.password1)
            }),
            flatMap(() => {
                return this.registrationService.reserve(this.eventDetail.id);
            }),
            map(() => {
                return true;
            })
        ).toPromise();
    }

    done(result: boolean): void {
        // remove any temporary auth token - user must log in
        if (result) {
            this.authService.resetUser();
            this.registered = true;
            this.currentStep = SignupStepsEnum.Complete;
        } else {
            this.registrationService.cancelReservation(this.group)
                .subscribe(() => {
                    this.authService.resetUser();
                    this.currentStep = 100; // incomplete
                });
        }
    }

    getAnimationDirection(index: number): string {
        const position = index - this.currentStep;
        if (position > 0) {
            return 'next';
        } else if (position < 0) {
            return 'previous';
        }
        return 'current';
    }
}
