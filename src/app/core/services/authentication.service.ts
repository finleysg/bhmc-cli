import { Injectable } from '@angular/core';
import { BhmcDataService } from './bhmc-data.service';
import { PasswordReset } from '../models/password-reset';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../models/user';
import { Cookie } from 'ng2-cookies';
import { MemberService } from './member.service';
import { ConfigService } from '../../app-config.service';
import { AppConfig } from '../../app-config';
import { BhmcErrorHandler } from './bhmc-error-handler.service';

declare const moment: any;

@Injectable()
export class AuthenticationService {

    private _rememberUser: boolean;
    private currentUserSource: BehaviorSubject<User>;
    public currentUser$: Observable<User>;
    private _currentUser: User;
    public redirectUrl: string;
    public returningMember: boolean; // temporary hack
    private config: AppConfig;

    constructor(
        private dataService: BhmcDataService,
        private memberService: MemberService,
        private configService: ConfigService,
        private errorHandler: BhmcErrorHandler
    ) {
        this.config = this.configService.config;
        if (!this._currentUser) {
            let storedUser = this.getFromStorage('bhmc_user', true);
            if (!storedUser) {
                this._currentUser = new User();
                this.saveToStorage('bhmc_user', JSON.stringify(this._currentUser)); // session storage
            } else {
                this._rememberUser = true;
                this._currentUser = Object.assign(new User(), JSON.parse(storedUser)); // TODO: IE polyfill
                if (this._currentUser.member && this._currentUser.member.birthDate) {
                    this._currentUser.member.birthDate = moment(this._currentUser.member.birthDate);
                }
                this.errorHandler.setUserContext(this._currentUser);
            }
        }
        this.currentUserSource = new BehaviorSubject(this._currentUser);
        this.currentUser$ = this.currentUserSource.asObservable();
        this.dataService.lastError$.subscribe(err => this.onError(err));
    }

    get user(): User {
        return this._currentUser;
    }

    login(username: string, password: string, remember: boolean): Promise<void> {

        this._rememberUser = remember;

        let email = '';
        if (username.indexOf('@') > 0) {
            email = username;
            username = '';
        }

        return this.dataService.postAuthRequest('login', {username: username, email: email, password: password})
            .flatMap((data: any) => {
                if (data && data.key) {
                    this.saveToStorage('bhmc_token', data.key);
                    return this.getUser();
                }
            })
            .flatMap(user => {
                this._currentUser = user;
                return this.memberService.isRegistered(this.config.registrationId, this._currentUser.member.id);
            })
            .flatMap(isCurrent => {
                this._currentUser.member.membershipIsCurrent = isCurrent;
                return this.memberService.isRegistered(this.config.matchPlayId, this._currentUser.member.id);
            })
            .map(isParticipant => {
                this._currentUser.member.matchplayParticipant = isParticipant;
                this.saveToStorage('bhmc_user', JSON.stringify(this._currentUser));
                this.errorHandler.setUserContext(this._currentUser);
                this.currentUserSource.next(this._currentUser);
                return;
            })
            .toPromise();
    }

    // during the registration process, we use this login to complete the registration
    quietLogin(username: string, password: string): Promise<void> {
        return this.dataService.postAuthRequest('login', {username: username, email: '', password: password})
            .map((data: any) => {
                if (data && data.key) {
                    this.saveToStorage('bhmc_token', data.key);
                    return;
                }
            })
            .toPromise();
    }

    logout(): Promise<void> {
        return this.dataService.postAuthRequest('logout', {})
            .toPromise()
            .then(() => this.resetUser())
            .catch(() => {
                this.resetUser();
            });
    }

    checkEmail(email: string): Promise<boolean> {
        return this.dataService.getApiRequest('members/check', {'e': email})
            .toPromise()
            .then(() => {
                return false;
            })
            .catch(() => {
                return true;  // TODO: only on a 409
            });
    }

    resetPassword(email: string): Promise<void> {
        return this.dataService.postAuthRequest('password/reset', {email: email}).toPromise();
    }

    changePassword(password1: string, password2: string): Promise<void> {
        return this.dataService.postAuthRequest('password/change', {
            'new_password1': password1,
            'new_password2': password2
        }).toPromise();
    }

    confirmReset(reset: PasswordReset): Promise<void> {
        return this.dataService.postAuthRequest('password/reset/confirm', reset.toJson()).toPromise();
    }

    createAccount(newUser: any): Promise<void> {
        return this.dataService.postApiRequest('members/register', newUser).toPromise();
    }

    updateAccount(partial: any): Promise<void> {
        return this.dataService.patchAuthRequest('user', partial)
            .map(data => {
                let user = new User().fromJson(data);
                this.saveToStorage('bhmc_user', JSON.stringify(user));
                this._currentUser = user;
                this.currentUserSource.next(this._currentUser);
                return;
            })
            .toPromise();
    }

    refreshUser(): void {
        this.getUser()
            .flatMap(user => {
                this._currentUser = user;
                return this.memberService.isRegistered(this.config.registrationId, this._currentUser.member.id);
            })
            .flatMap(isCurrent => {
                this._currentUser.member.membershipIsCurrent = isCurrent;
                return this.memberService.isRegistered(this.config.matchPlayId, this._currentUser.member.id);
            })
            .map(isParticipant => {
                this._currentUser.member.matchplayParticipant = isParticipant;
                this.saveToStorage('bhmc_user', JSON.stringify(this._currentUser));
                this.currentUserSource.next(this._currentUser);
                return;
            })
            .toPromise()
            .then(() => {return;}); // no-op - force the call
    }

    getUser(): Observable<User> {
        return this.dataService.getAuthRequest('user')
            .map((data: any) => {
                return new User().fromJson(data);
            })
            .catch(() => {
                this.removeFromStorage('bhmc_token');
                return Observable.of(new User());
            });
    }

    onError(message: string): void {
        if (message === 'Invalid token.') {
            this.resetUser();
        }
    }

    resetUser(): void {
        Cookie.delete('crsftoken');
        this.removeFromStorage('bhmc_token');
        this._currentUser = new User();
        this.currentUserSource.next(this._currentUser);
        this.saveToStorage('bhmc_user', JSON.stringify(this._currentUser));
        this.errorHandler.clearUserContext();
    }

    private getFromStorage(key: string, override: boolean = false): string {
        if (this._rememberUser || override) {
            return localStorage.getItem(key);
        }
        return sessionStorage.getItem(key);
    }

    private saveToStorage(key: string, data: string, override: boolean = false): void {
        if (this._rememberUser || override) {
            localStorage.setItem(key, data);
        } else {
            sessionStorage.setItem(key, data);
        }
    }

    private removeFromStorage(key: string, override: boolean = false): void {
        if (this._rememberUser || override) {
            localStorage.removeItem(key);
        }
        sessionStorage.removeItem(key);
    }
}
