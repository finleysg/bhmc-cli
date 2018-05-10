import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { MemberService, SavedCard, AuthenticationService } from '../../core';
import { StripeCreditCard } from './stripe-credit-card';
import { AppConfig } from '../../app-config';
import { ConfigService } from '../../app-config.service';
import { FormGroup } from '@angular/forms';
import { CreditCardForm } from './credit-card.form';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ToasterService } from 'angular2-toaster';

declare const Stripe: any;
declare const Spinner: any;

@Component({
    moduleId: module.id,
    selector: 'app-saved-card',
    templateUrl: 'saved-card.component.html',
    styleUrls: ['saved-card.component.css']
})
export class SavedCardComponent implements OnInit {

    @Output() onClose = new EventEmitter<boolean>();
    @ViewChild('cardModal') cardModal: ModalDirective;

    public card: StripeCreditCard;
    public cardForm: FormGroup;
    public cardErrors: any;
    public messages: string[];
    private config: AppConfig;
    private spinner: any;
    private spinnerElement: any;

    constructor(
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
        this.initSpinner();
    }

    open(): void {
        this.messages.length = 0;
        this.card.number = '';
        this.card.cvc = '';
        this.card.exp = '';
        //noinspection TypeScriptValidateTypes
        this.cardModal.config = { backdrop: 'static', keyboard: false };
        this.cardModal.show();
    }

    onShown(): void {
        this.spinnerElement = this.elementRef.nativeElement.querySelector('#spinner-span');
    }

    cancel(): void {
        this.cardModal.hide();
        this.onClose.emit(false);
    }

    saveCard(): void {
        if (this.isCardValid()) {
            this.spinner.spin(this.spinnerElement);
            this.creditCardForm.updateValue(this.card);
            this.card.createToken()
                .then((token: string) => {
                    this.memberService.saveNewCard(token).toPromise();
                }).then(() => {
                    this.spinner.stop();
                    this.toaster.pop('success', 'Card Saved', 'Your card has been saved.');
                    this.cardModal.hide();
                    this.onClose.emit(true);
                }).catch((response: any) => {
                    this.spinner.stop();
                    this.messages.length = 0;
                    this.messages.push(response);
                });
        }
    }

    private isCardValid(): boolean {
        return this.cardErrors.number === '' &&
               this.cardErrors.expiry === '' &&
               this.cardErrors.cvc === '';
    }

    private initSpinner() {
        const options = {
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
