import { Observable ,  BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { NewUser } from './new-user';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../app-config.service';
import { MemberService, PublicMember } from '../../../core';
import * as moment from 'moment';

export enum SignupStepsEnum {
    NotStarted = 0,
    PatronCard,
    EmailCheck,
    NameAndBirthdate,
    Address,
    FormerClub,
    TeePreference,
    Credentials,
    Pay,
    Complete,
    DuplicateEmail,
    DuplicateGhin,
    Incomplete
}

@Injectable()
export class SignupService {

    private _numberOfSteps = 8;
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

    addError(err: string): void {
        this._errors.push(err);
        this._errorSource.next(this._errors);
    }

    startSignup(): void {
        this.clearErrors();
        this._state.currentStep = SignupStepsEnum.PatronCard;
        this._currentState$.next(this._state);
    }

    gotoStep(step: number, user: NewUser = null): boolean {
        let result = true;
        this.clearErrors();
        if (user) {
            switch (<SignupStepsEnum>step) {
                case SignupStepsEnum.EmailCheck:
                    result = this.validateEmail(user);
                    break;
                case SignupStepsEnum.NameAndBirthdate:
                    result = this.validateNameAndBirthdate(user);
                    break;
                case SignupStepsEnum.Address:
                    result = this.validateAddress(user);
                    break;
                case SignupStepsEnum.FormerClub:
                    result = this.validateGhin(user);
                    break;
                case SignupStepsEnum.TeePreference:
                    result = this.validateTeePreference(user);
                    break;
                case SignupStepsEnum.Credentials:
                    result = this.validateCredentials(user);
                    break;
                case SignupStepsEnum.PatronCard:
                    // no-op
                    break;
                default:
                    throw new Error(`step ${step} is not valid`);
            }
            if (result) {
                this._state.currentStep = step + 1;
            }
        } else {
            this._state.currentStep = step;
        }
        this._currentState$.next(this._state);
        return result;
    }

    validateEmail(user: NewUser): boolean {
        this.clearErrors();
        if (!user.email) {
            this.addError('an email is required');
            return false;
        }
        const exists = this._members.findIndex(m => m.email.toLowerCase() === user.email.toLowerCase()) >= 0;
        if (!exists) {
            this._state.userDetail.email = user.email.toLowerCase();
            this._state.currentStep = SignupStepsEnum.NameAndBirthdate;
        } else {
            this._state.emailExists = true;
            this.addError(`${user.email} already exists`);
        }
        return exists;
    }

    validateNameAndBirthdate(user: NewUser): boolean {
        this.clearErrors();
        let isValid = true;
        if (!user.firstName) {
            isValid = false;
            this.addError('a first name is required');
        }
        if (!user.lastName) {
            isValid = false;
            this.addError('a last name is required');
        }
        if (!user.birthDate || !moment(user.birthDate).isValid()) {
            isValid = false;
            this.addError('a valid birth date is required');
        }
        if (isValid) {
            this._state.userDetail.firstName = user.firstName;
            this._state.userDetail.lastName = user.lastName;
            this._state.userDetail.birthDate = user.birthDate;
            this._state.currentStep = SignupStepsEnum.Address;
        }
        return isValid;
    }

    validateGhin(user: NewUser): boolean {
        this.clearErrors();
        let isValid = true;
        if (user.noHandicap) {
            user.ghin = '';
            user.formerClubName = '';
        } else {
            if (!user.formerClubName) {
                isValid = false;
                this.addError('please enter the name of the club where you last had a handicap');
            }
            if (!user.ghin) {
                isValid = false;
                this.addError('a GHIN is required');
            } else {
                if (isNaN(<any>user.ghin - parseFloat(user.ghin))) {
                    isValid = false;
                    this.addError('a GHIN must contain only numbers');
                } else {
                    const exists = this._members.findIndex(m => +m.ghin === +user.ghin) >= 0;
                    if (exists) {
                        isValid = false;
                        this._state.ghinExists = true;
                        this.addError(`${user.ghin} already exists`);
                    }
                }
            }
        }
        if (isValid) {
            this._state.userDetail.ghin = user.ghin ? (+user.ghin).toString() : '';
            this._state.userDetail.formerClubName = user.formerClubName;
            this._state.currentStep = SignupStepsEnum.TeePreference;
        }
        return isValid;
    }

    validateTeePreference(user: NewUser): boolean {
        this.clearErrors();
        this._state.userDetail.forwardTees = user.forwardTees;
        this._state.currentStep = SignupStepsEnum.Credentials;
        return true;
    }

    validateCredentials(user: NewUser): boolean {
        this.clearErrors();
        let isValid = true;
        if (!user.username) {
            isValid = false;
            this.addError('a unique username is required');
        }
        if (!user.password1) {
            isValid = false;
            this.addError('a password is required');
        }
        if (user.password1 !== user.password2) {
            isValid = false;
            this.addError('the passwords do not match');
        }
        if (isValid) {
            this._state.currentStep = SignupStepsEnum.PatronCard;
            this._state.userDetail.username = user.username;
            this._state.userDetail.password1 = user.password1;
            this._state.userDetail.password2 = user.password2;
        }
        return isValid;
    }

    validateAddress(user: NewUser): boolean {
        this.clearErrors();
        const isValid = !(!user.address || !user.city || !user.state || !user.zip || !user.phoneNumber);
        if (isValid) {
            this._state.userDetail.address = user.address;
            this._state.userDetail.city = user.city;
            this._state.userDetail.state = user.state;
            this._state.userDetail.zip = user.zip;
            this._state.userDetail.phoneNumber = user.phoneNumber;
            this._state.currentStep = SignupStepsEnum.FormerClub;
        } else {
            this.addError('all of the address information is required for new members');
        }
        return isValid;
    }
}
