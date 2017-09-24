import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { StripeCreditCard } from './stripe-credit-card';

declare const Stripe: any;

@Injectable()
export class CreditCardForm {

    private stripe: any;
    private formSource: Subject<FormGroup>;
    private errorSource: BehaviorSubject<any>;
    public form$: Observable<FormGroup>;
    public errors$: Observable<any>;

    private cardForm: FormGroup;
    private messages = {
        'number': {
            'required': 'A card number is required',
            'invalid': 'The card number is invalid'
        },
        'expiry': {
            'required': 'An expiration date is required',
            'invalid': 'The expiration date is invalid or past'
        },
        'cvc': {
            'required': 'A CV code is required',
            'invalid': 'The CV code is invalid'
        }
    };
    private errors = {
        'number': '',
        'expiry': '',
        'cvc': ''
    };

    constructor(
        private builder: FormBuilder
    ) {
        this.stripe = Stripe;
        this.formSource = new Subject();
        this.errorSource = new BehaviorSubject({});
        this.form$ = this.formSource.asObservable();
        this.errors$ = this.errorSource.asObservable();
    }

    buildForm(card: StripeCreditCard): void {
        this.cardForm = this.builder.group({
            'number': [card.number, [Validators.required, this.numberValidator]],
            'expiry': [card.exp, [Validators.required, this.expiryValidator]],
            'cvc': [card.cvc, [Validators.required, this.cvcValidator]]
        });

        this.cardForm.statusChanges.subscribe(() => this.onStatusChanged());
        this.onStatusChanged();

        this.formSource.next(this.cardForm);
    }

    updateValue(card: StripeCreditCard): void {
        Object.assign(card, this.cardForm.value);
        card.exp = this.cardForm.value.expiry.replace(' ', '')
    }

    onStatusChanged(): void {
        if (!this.cardForm) { return; }
        const form = this.cardForm;
        for (const field in this.errors) {
            this.errors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.messages[field];
                for (const key in control.errors) {
                    this.errors[field] += messages[key] + ' ';
                }
            }
        }
        this.errorSource.next(this.errors);
    };

    numberValidator = (control: FormControl): {[key: string]: boolean} => {
        const cardNumber = control.get('number');
        if (cardNumber && cardNumber.value) {
            const valid = this.stripe.card.validateCardNumber(cardNumber.value);
            if (!valid) {
                return { 'invalid': true };
            }
        }
        return null;
    };

    expiryValidator = (control: FormControl): {[key: string]: boolean} => {
        const exp = control.get('expiry');
        if (exp && exp.value) {
            const valid = this.stripe.card.validateExpiry(exp.value);
            if (!valid) {
                return { 'invalid': true };
            }
        }
        return null;
    };

    cvcValidator = (control: FormControl): {[key: string]: boolean} => {
        const cvc = control.get('cvc');
        if (cvc && cvc.value) {
            const valid = this.stripe.card.validateCVC(cvc.value);
            if (!valid) {
                return { 'invalid': true };
            }
        }
        return null;
    };
}
