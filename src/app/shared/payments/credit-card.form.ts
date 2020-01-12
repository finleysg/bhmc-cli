import { Injectable } from '@angular/core';
import { Subject ,  BehaviorSubject ,  Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { StripeCreditCard } from './stripe-credit-card';

declare const Stripe: any;

@Injectable()
export class CreditCardForm {

    private stripe: any;
    private formSource: Subject<FormGroup>;
    private errorSource: BehaviorSubject<any>;
    public form$: Observable<FormGroup>;
    public errors$: Observable<any>;

    private cardForm?: FormGroup;

    private messages: {[index: string]: any} = {
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
    private errors: {[index: string]: any} = {
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
        if (this.cardForm) {
            Object.assign(card, this.cardForm.value);
            card.exp = this.cardForm.value.expiry.replace(' ', '');
        }
    }

    onStatusChanged(): void {
        if (!this.cardForm) { return; }
        const form = this.cardForm;
        // tslint:disable-next-line: forin
        for (const field in this.errors) {
            this.errors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.messages[field];
                // tslint:disable-next-line: forin
                for (const key in control.errors) {
                    this.errors[field] += messages[key] + ' ';
                }
            }
        }
        this.errorSource.next(this.errors);
    }

    numberValidator = (control: FormControl): {[key: string]: boolean} | null => {
        const cardNumber = control.get('number');
        if (cardNumber && cardNumber.value) {
            const valid = this.stripe.card.validateCardNumber(cardNumber.value);
            if (!valid) {
                return { 'invalid': true };
            }
        }
        return null;
    }

    expiryValidator = (control: FormControl): {[key: string]: boolean} | null => {
        const exp = control.get('expiry');
        if (exp && exp.value) {
            const valid = this.stripe.card.validateExpiry(exp.value);
            if (!valid) {
                return { 'invalid': true };
            }
        }
        return null;
    }

    cvcValidator = (control: FormControl): {[key: string]: boolean} | null => {
        const cvc = control.get('cvc');
        if (cvc && cvc.value) {
            const valid = this.stripe.card.validateCVC(cvc.value);
            if (!valid) {
                return { 'invalid': true };
            }
        }
        return null;
    }
}
