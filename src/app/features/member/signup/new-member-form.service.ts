import { Injectable } from '@angular/core';
import { NewUser } from './new-user';
import { uniqueNameValidator } from './unique-name.validator';
import { AbstractControl, FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { NewMemberDataService, CheckType } from './new-member-data.service';
import * as _ from 'lodash';
declare const moment: any;

@Injectable()
export class NewMemberForm {

    private formSource: Subject<FormGroup>;
    private errorSource: BehaviorSubject<any>;
    public form$: Observable<FormGroup>;
    public errors$: Observable<any>;

    private userForm: FormGroup;

    fieldErrors = {
        'username': '',
        'firstName': '',
        'lastName': '',
        'birthDate': '',
        'email': '',
        'password1': ''
    };

    formErrors = {
        'club': '',
        'passwords': ''
    };

    validationMessages = {
        'username': {
            'required': 'A unique username is required.',
            'exists': 'That username is not available.'
        },
        'firstName': {
            'required': 'Your first name is required.'
        },
        'lastName': {
            'required': 'Your last name is required.'
        },
        'birthDate': {
            'required': 'Your birth date is required.',
            'bad-date': 'The date is not valid.'
        },
        'email': {
            'required': 'A valid email is required.',
            'exists': 'It looks like you have already signed up at one point with that email.'
        },
        'password1': {
            'required': 'A password is required',
        },
        'passwords': {
            'no-match': 'The passwords do not match.'
        },
        'club': {
            'no-club': 'Where did you have your handicap?'
        }
    };

    constructor(private builder: FormBuilder, private newMemberService: NewMemberDataService) {
        this.formSource = new Subject();
        this.errorSource = new BehaviorSubject({});
        this.form$ = this.formSource.asObservable();
        this.errors$ = this.errorSource.asObservable();
    }

    buildForm(user: NewUser): void {
        this.userForm = this.builder.group({
            'username': [user.username, [Validators.required], [uniqueNameValidator(CheckType.Username, this.newMemberService)]],
            'firstName': [user.firstName, [Validators.required]],
            'lastName': [user.lastName, [Validators.required]],
            'birthDate': [user.birthDate, [Validators.required, this.dateValidator]],
            'phoneNumber': [user.phoneNumber],
            'email': [user.email, [Validators.required], [uniqueNameValidator(CheckType.Email, this.newMemberService)]],
            'forwardTees': [user.forwardTees],
            'password1': [user.password1,  [Validators.required]],
            'password2': [user.password2],
            'ghin': [user.ghin],
            'formerClubName': [user.formerClubName],
            'formerClubNumber': [user.formerClubNumber]
        }, { validator: this.formValidator });

        this.userForm.statusChanges.subscribe(() => this.onStatusChanged());
        this.onStatusChanged();

        this.formSource.next(this.userForm);
    }

    updateValue(user: NewUser): void {
        Object.assign(user, this.userForm.value);
        user.forwardTees = user.forwardTees || false;
    }

    onStatusChanged(): void {
        if (!this.userForm) { return; }
        const form = this.userForm;

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
        // form-level validators
        this.formErrors['club'] = '';
        this.formErrors['passwords'] = '';
        if (form.invalid) {
            let messages = _.merge({}, this.validationMessages['club'], this.validationMessages['passwords']);
            for (const key in form.errors) {
                if (key === 'no-club') this.formErrors['club'] += messages[key] + ' ';
                if (key === 'no-match') this.formErrors['passwords'] += messages[key] + ' ';
            }
        }

        this.errorSource.next(_.merge({}, this.fieldErrors, this.formErrors));
    };

    formValidator = (control: AbstractControl): {[key: string]: boolean} => {
        const password = control.get('password1');
        const confirm = control.get('password2');
        const ghin = control.get('ghin');
        const club = control.get('formerClubName');
        if (!ghin || !club || !password || !confirm) {
            return null;
        }
        if (password.value !== confirm.value) {
            return {'no-match': true};
        }
        if (ghin.value && ghin.value.length > 0 && !club.value) {
            return {'no-club': true};
        }
        return null;
    };

    dateValidator = (control: FormControl): {[key: string]: boolean} => {
        const dt = control.get('birthDate');
        if (dt) {
            if (!moment(dt.value).isValid()) {
                return {'bad-date': true};
            }
        }
        return null;
    };
}
