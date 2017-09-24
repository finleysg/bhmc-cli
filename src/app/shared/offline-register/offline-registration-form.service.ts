import { Injectable } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { OfflineRegistration } from './offline-registration';
declare const moment: any;

@Injectable()
export class OfflineRegistrationForm {

    private formSource: Subject<FormGroup>;
    private errorSource: BehaviorSubject<any>;
    public form$: Observable<FormGroup>;
    public errors$: Observable<any>;

    private offlineForm: FormGroup;

    fieldErrors = {
        'paymentNotes': '',
        'paymentAmount': ''
    };

    validationMessages = {
        'paymentNotes': {
            'required': 'Include a check number or "cash".'
        },
        'paymentAmount': {
            'required': 'Payment amount is required (no dollar sign).'
        }
    };

    constructor(private builder: FormBuilder) {
        this.formSource = new Subject();
        this.errorSource = new BehaviorSubject({});
        this.form$ = this.formSource.asObservable();
        this.errors$ = this.errorSource.asObservable();
    }

    buildForm(registration: OfflineRegistration): void {
        this.offlineForm = this.builder.group({
            'paymentMethod': [registration.paymentMethod],
            'paymentNotes': [registration.paymentNotes, [Validators.required]],
            'paymentAmount': [registration.paymentAmount, [Validators.required]],
            'members': [registration.members],
            'forwardTees': [registration.forwardTees]
        });

        this.offlineForm.statusChanges.subscribe(() => this.onStatusChanged());
        this.onStatusChanged();

        this.formSource.next(this.offlineForm);
    }

    updateValue(registration: OfflineRegistration): void {
        Object.assign(registration, this.offlineForm.value);
        registration.forwardTees = registration.forwardTees || false;
    }

    onStatusChanged(): void {
        if (!this.offlineForm) { return; }
        const form = this.offlineForm;

        // field validators
        for (const field in this.fieldErrors) {
            // clear previous error message (if any)
            this.fieldErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.fieldErrors[field] += messages[key] + ' ';
                }
            }
        }

        this.errorSource.next(this.fieldErrors);
    };
}
