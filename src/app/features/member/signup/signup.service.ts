import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { NewUser } from './new-user';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../app-config.service';
import { MemberService, PublicMember } from '../../../core';
import * as moment from 'moment';

export enum SignupStepsEnum {
    NotStarted = 0,
    EmailCheck,
    NameAndBirthdate,
    FormerClub,
    TeePreference,
    Credentials,
    PatronCard,
    Complete
}

@Injectable()
export class SignupService {

    private _numberOfSteps = 7;
    private _state: {
        steps: number[],
        currentStep: SignupStepsEnum,
        userDetail: NewUser,
        emailExists: boolean,
        ghinExists: boolean
    };
    private _currentState$: BehaviorSubject<any>;
    private _errorSource: BehaviorSubject<string[]>;
    private _apiUrl: string;
    private _members: PublicMember[];
    private _errors: string[];
    errors$: Observable<string[]>;

    constructor(
        private http: HttpClient,
        private memberService: MemberService,
        private configService: ConfigService
    ) {
        this._apiUrl = configService.config.apiUrl;
        this._currentState$ = new BehaviorSubject({});
        this._errorSource = new BehaviorSubject([]);
        this.init();
    }

    get currentState(): Observable<any> {
        return this._currentState$.asObservable();
    }

    init(): void {
        this.memberService.getMembers().subscribe(members => this._members = members);
        this._state = {
            steps: [],
            currentStep: SignupStepsEnum.NotStarted,
            userDetail: new NewUser(),
            emailExists: false,
            ghinExists: false
        };
        for (let i = 0; i < this._numberOfSteps; i++) {
            this._state.steps.push(i + 1);
        }
        this._currentState$.next(this._state);
        this.errors$ = this._errorSource.asObservable();
        this.clearErrors();
    }

    clearErrors(): void {
        this._errors = [];
        this._state.emailExists = false;
        this._state.ghinExists = false;
        this._errorSource.next(this._errors);
    }

    private addError(err: string): void {
        this._errors.push(err);
        this._errorSource.next(this._errors);
    }

    startSignup(): void {
        this.clearErrors();
        this._state.currentStep = SignupStepsEnum.EmailCheck;
        this._currentState$.next(this._state);
    }

    validateEmail(email: string): boolean {
        this.clearErrors();
        const exists = this._members.findIndex(m => m.email.toLowerCase() === email.toLowerCase()) >= 0;
        if (!exists) {
            this._state.userDetail.email = email.toLowerCase();
            this._state.currentStep = SignupStepsEnum.NameAndBirthdate;
        } else {
            this._state.emailExists = true;
            this.addError(`${email} already exists`)
        }
        this._currentState$.next(this._state);
        return exists;
    }

    validateNameAndBirthdate(firstName: string, lastName: string, birthDate: string): boolean {
        this.clearErrors();
        let isValid = true;
        if (!firstName) {
            isValid = false;
            this.addError('a first name is required');
        }
        if (!lastName) {
            isValid = false;
            this.addError('a last name is required');
        }
        if (!birthDate || !moment(birthDate).isValid()) {
            isValid = false;
            this.addError('a valid birth date is required');
        }
        if (isValid) {
            this._state.userDetail.firstName = firstName;
            this._state.userDetail.lastName = lastName;
            this._state.userDetail.birthDate = birthDate;
            this._state.currentStep = SignupStepsEnum.FormerClub;
        }
        this._currentState$.next(this._state);
        return isValid;
    }

    validateGhin(ghin: string, formerClub: string): boolean {
        this.clearErrors();
        let isValid = true;
        if (ghin) {
            if (isNaN(<any>ghin - parseFloat(ghin))) {
                isValid = false;
                this.addError('a GHIN must contain only numbers');
            } else {
                const exists = this._members.findIndex(m => +m.ghin === +ghin) >= 0;
                if (exists) {
                    isValid = false;
                    this._state.ghinExists = true;
                    this.addError(`${ghin} already exists`);
                }
                if (!formerClub) {
                    isValid = false;
                    this.addError('please provide the name of the club where you kept your handicap last year');
                }
            }
        }
        if (isValid) {
            this._state.userDetail.ghin = ghin ? (+ghin).toString() : '';
            this._state.userDetail.formerClubName = formerClub;
            this._state.currentStep = SignupStepsEnum.TeePreference;
        }
        this._currentState$.next(this._state);
        return isValid;
    }
    
    validateTeePreference(forward: boolean): boolean {
        this.clearErrors();
        this._state.userDetail.forwardTees = forward;
        this._state.currentStep = SignupStepsEnum.Credentials;
        this._currentState$.next(this._state);
        return true;
    }
    
    validateCredentials(username: string, password1: string, password2: string): boolean {
        this.clearErrors();
        let isValid = true;
        if (!username) {
            isValid = false;
            this.addError('a unique username is required');
        }
        if (!password1) {
            isValid = false;
            this.addError('a password is required');
        }
        if (password1 !== password2) {
            isValid = false;
            this.addError('the passwords do not match');
        }
        if (isValid) {
            this._state.currentStep = SignupStepsEnum.PatronCard;
            this._state.userDetail.username = username;
            this._state.userDetail.password1 = password1;
            this._state.userDetail.password2 = password2;
        }
        this._currentState$.next(this._state);
        return isValid;
    }
}
