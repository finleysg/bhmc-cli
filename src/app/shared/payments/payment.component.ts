import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { MemberService, SavedCard, AuthenticationService,
         RegistrationService, EventDetail, EventRegistrationGroup } from '../../core';
import { StripeCreditCard } from './stripe-credit-card';
import { AppConfig } from '../../app-config';
import { ConfigService } from '../../app-config.service';
import { FormGroup } from '@angular/forms';
import { CreditCardForm } from './credit-card.form';
// import { Stripe } from 'stripe';

declare const Stripe: any;
declare const Spinner: any;

export enum ProcessingStatus {
    Pending = 0,
    Validating,
    Processing,
    Complete,
    Invalid,
    Failure
}

class ProcessingState {
    text: string;
    style: string;
    icon: string;
    disabled: boolean;
    complete: boolean;
}

class ProcessingResult {
    text: string;
    style: string;

    constructor(text: string, style: string) {
        this.text = text;
        this.style = style;
    }
}

@Component({
    moduleId: module.id,
    selector: 'payment',
    templateUrl: 'payment.component.html',
    styleUrls: ['payment.component.css']
})
export class PaymentComponent implements OnInit {

    @Input() registrationGroup: EventRegistrationGroup;
    @Input() eventDetail: EventDetail;
    @Output() onClose = new EventEmitter<boolean>();
    @ViewChild('paymentModal') paymentModal: ModalDirective;

    public card: StripeCreditCard;
    public cardForm: FormGroup;
    public cardErrors: any;
    public messages: ProcessingResult[];
    public processStatus: ProcessingStatus;
    public savedCard: SavedCard;
    public hasSavedCard: boolean;
    public useSavedCard: boolean;

    private config: AppConfig;
    private spinner: any;
    private spinnerElement: any;

    constructor(
        private registrationService: RegistrationService,
        private memberService: MemberService,
        private creditCardForm: CreditCardForm,
        private authService: AuthenticationService,
        private elementRef: ElementRef,
        private configService: ConfigService,
        private toaster: ToasterService
    ) {
        this.config = configService.config;
        Stripe.setPublishableKey(this.config.stripePublicKey);
    }

    ngOnInit() {
        this.messages = [];
        this.card = new StripeCreditCard();
        this.creditCardForm.form$.subscribe(form => this.cardForm = form);
        this.creditCardForm.errors$.subscribe(errors => this.cardErrors = errors);
        this.creditCardForm.buildForm(this.card);
        if (this.authService.user.isAuthenticated) {
            this.memberService.stripeSavedCard().then((savedCard: SavedCard) => {
                this.savedCard = savedCard;
                this.hasSavedCard = savedCard.last4.length > 0;
                this.useSavedCard = this.hasSavedCard;
                this.toggleSavedCard();
            });
        }
        this.initSpinner();
    };

    private toggleDisabledState() {
        if (this.cardForm) {
            const nbrControl = this.cardForm.get('number');
            if (nbrControl && nbrControl.disabled != this.useSavedCard) {
                this.useSavedCard ? nbrControl.disable() : nbrControl.enable();
            }
            const expControl = this.cardForm.get('expiry');
            if (expControl && expControl.disabled != this.useSavedCard) {
                this.useSavedCard ? expControl.disable() : expControl.enable();
            }
            const cvcControl = this.cardForm.get('cvc');
            if (cvcControl && cvcControl.disabled != this.useSavedCard) {
                this.useSavedCard ? cvcControl.disable() : cvcControl.enable();
            }
        }
    }

    open(): void {
        this.messages.length = 0;
        this.processStatus = ProcessingStatus.Pending;
        this.paymentModal.config = { backdrop: 'static', keyboard: false };
        this.paymentModal.show();
    }

    onShown(): void {
        this.spinnerElement = this.elementRef.nativeElement.querySelector('#spinner-span');
    }

    cancelPayment(): void {
        this.paymentModal.hide();
        this.onClose.emit(false);
    };

    toggleSavedCard(): void {
        if (!this.cardForm) return;
        if (this.useSavedCard) {
            this.cardForm.patchValue({
                number: this.savedCard.cardNumber,
                expiry: this.savedCard.expires,
                cvc: this.savedCard.cvc
            });
        } else {
            this.cardForm.patchValue({
                number: '',
                expiry: '',
                cvc: ''
            });
        }
        this.toggleDisabledState();
    }

    processPayment(): void {
        if (this.processStatus === ProcessingStatus.Complete) {
            this.paymentModal.hide();
            this.onClose.emit(true);
        } else {
            if (this.useSavedCard) {
                this.quickPayment();
            } else {
                if (this.isCardValid()) {
                    this.fullPayment();
                }
            }
        }
    };

    private isCardValid(): boolean {
        return this.cardErrors.number === '' &&
               this.cardErrors.expiry === '' &&
               this.cardErrors.cvc === '';
    }

    quickPayment(): void {
        this.processStatus = ProcessingStatus.Processing;
        this.spinner.spin(this.spinnerElement);
        this.registrationService.register(this.registrationGroup)
            .then((conf: string) => {
                this.successState(conf);
            }).catch(response => {
                this.errorState(response);
            });
    };

    fullPayment(): void {
        this.processStatus = ProcessingStatus.Validating;
        this.spinner.spin(this.spinnerElement);
        this.creditCardForm.updateValue(this.card);
        this.card.createToken()
            .then((token: string) => {
                this.processStatus = ProcessingStatus.Processing;
                this.registrationGroup.cardVerificationToken = token;
                return this.registrationService.register(this.registrationGroup);
            }).then((conf: string) => {
                this.successState(conf);
            }).catch((response: any) => {
                this.errorState(response);
            });
    };

    successState(confirmation: string): void {
        this.spinner.stop();
        this.processStatus = ProcessingStatus.Complete;
        this.messages.length = 0;
        this.messages.push(new ProcessingResult('Payment complete', 'text-success'));
        this.messages.push(new ProcessingResult('Confirmation #: ' + confirmation, 'text-success'));
        this.toaster.pop('success', 'Payment Complete', `Your payment for ${this.registrationGroup.payment.total} has been processed.`);
    };

    errorState(message: any): void {
        this.spinner.stop();
        this.processStatus = ProcessingStatus.Failure;
        this.messages.length = 0;
        if (!message) {
            this.messages.push(new ProcessingResult('Connection failure or timeout', 'text-danger'));
            this.toaster.pop('error', 'Connection Problem', 'Your internet connection is down or unavailable');
        } else {
            this.messages.push(new ProcessingResult(message, 'text-danger'));
            this.toaster.pop('error', 'Payment Error', message);
        }
    }

    get currentState(): ProcessingState {
        let state = new ProcessingState();
        switch (this.processStatus) {
            case ProcessingStatus.Validating:
                state.text = 'Validating';
                state.style = 'btn-info';
                state.icon = 'zmdi-download';
                state.disabled = true;
                break;
            case ProcessingStatus.Processing:
                state.text = 'Processing';
                state.style = 'btn-info';
                state.icon = 'zmdi-upload';
                state.disabled = true;
                break;
            case ProcessingStatus.Complete:
                state.text = 'Payment Complete';
                state.style = 'btn-success';
                state.icon = 'zmdi-check';
                state.disabled = false;
                state.complete = true;
                break;
            case ProcessingStatus.Invalid:
                state.text = 'Retry';
                state.style = 'btn-warning';
                state.icon = 'zmdi-close';
                state.disabled = false;
                break;
            case ProcessingStatus.Failure:
                state.text = 'Retry';
                state.style = 'btn-danger';
                state.icon = 'zmdi-close';
                state.disabled = false;
                break;
            default:
                state.text = 'Submit Payment';
                state.style = 'btn-primary';
                state.icon = 'zmdi-money';
                state.disabled = false;
        }
        return state;
    }

    private initSpinner() {
        let options = {
            lines: 17,
            length: 0,
            width: 10,
            radius: 25,
            scale: 0.5,
            corners: 1.0,
            color: '#fff',
            opacity: 0.05,
            rotate: 0,
            direction: 1,
            speed: 0.7,
            trail: 60,
            zIndex: 2e9, // Artificially high z-index to keep on top
        };
        this.spinner = new Spinner(options);
    }
}
