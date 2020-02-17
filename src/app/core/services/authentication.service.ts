import { Injectable } from '@angular/core';
import { BhmcDataService } from './bhmc-data.service';
import { PasswordReset } from '../models/password-reset';
import { Observable ,  BehaviorSubject ,  of } from 'rxjs';
import { User } from '../models/user';
import { Cookie } from 'ng2-cookies';
import { MemberService } from './member.service';
import { ConfigService } from '../../app-config.service';
import { AppConfig } from '../../app-config';
import { BhmcErrorHandler } from './bhmc-error-handler.service';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';

import moment from 'moment';

@Injectable()
export class AuthenticationService {

    private _rememberUser = false;
    private currentUserSource: BehaviorSubject<User>;
    public currentUser$: Observable<User>;
    private _currentUser: User;
    public redirectUrl?: string;
    private config: AppConfig;

    constructor(
        private dataService: BhmcDataService,
        private memberService: MemberService,
        private configService: ConfigService,
        private errorHandler: BhmcErrorHandler
    ) {
        const token = this.getFromStorage('bhmc_token', true);
        this.config = this.configService.config;
        this._currentUser = new User({});
        this.currentUserSource = new BehaviorSubject(this._currentUser);
        this.currentUser$ = this.currentUserSource.asObservable();
        this.errorHandler.lastError$.subscribe(err => this.onError(err));
        if (token) {
            this.refreshUser();
        }
    }

    get user(): User {
        return this._currentUser;
    }

    login(username: string, password: string, remember: boolean): Observable<void> {

        this._rememberUser = remember;

        let email = '';
        if (username.indexOf('@') > 0) {
            email = username;
            username = '';
        }

        return this.dataService.postAuthRequest('login', {username: username, email: email, password: password}).pipe(
            mergeMap((data: any) => {
                if (data && data.key) {
                    this.saveToStorage('bhmc_token', data.key);
                }
                return this.getUser();
            }),
            mergeMap((user: User) => {
                this._currentUser = user;
                return this.memberService.isRegistered(this.config.registrationId, this._currentUser.member.id);
            }),
            mergeMap(isCurrent => {
                this._currentUser.member.membershipIsCurrent = isCurrent;
                return this.memberService.isRegistered(this.config.matchPlayId, this._currentUser.member.id);
            }),
            map(isParticipant => {
                this._currentUser.member.matchplayParticipant = isParticipant;
                this.errorHandler.setUserContext(this._currentUser);
                this.currentUserSource.next(this._currentUser);
                return;
            })
        );
    }

    // during the registration process, we use this login to complete the registration
    quietLogin(username: string, password: string): Observable<void> {
        return this.dataService.postAuthRequest('login', {username: username, email: '', password: password}).pipe(
            map((data: any) => {
                if (data && data.key) {
                    this.saveToStorage('bhmc_token', data.key);
                    return;
                }
            })
         );
    }

    logout(): void {
        this.dataService.postAuthRequest('logout', {}).subscribe(
            () => this.resetUser(),   // onNext
            (err) => this.resetUser() // onError
        );
    }

    checkEmail(email: string): Observable<boolean> {
        return this.dataService.getApiRequest('members/check', {'e': email}).pipe(
            map(() => {
                return false;
            }),
            catchError(() => {
                return of(true);  // TODO: only on a 409
            })
        );
    }

    resetPassword(email: string): Observable<void> {
        return this.dataService.postAuthRequest('password/reset', {email: email});
    }

    changePassword(password1: string, password2: string): Observable<void> {
        return this.dataService.postAuthRequest('password/change', {
            'new_password1': password1,
            'new_password2': password2
        });
    }

    confirmReset(reset: PasswordReset): Observable<void> {
        return this.dataService.postAuthRequest('password/reset/confirm', reset.toJson());
    }

    createAccount(newUser: any): Observable<void> {
        return this.dataService.postApiRequest('members/register', newUser);
    }

    updateAccount(partial: any): Observable<void> {
        return this.dataService.patchAuthRequest('user', partial).pipe(
            tap(() => {
                this.refreshUser();
            })
        );
    }

    refreshUser(): void {
        this.getUser().pipe(
            mergeMap(user => {
                this._currentUser = user;
                return this.memberService.isRegistered(this.config.registrationId, this._currentUser.member.id);
            }),
            mergeMap(isCurrent => {
                this._currentUser.member.membershipIsCurrent = isCurrent;
                return this.memberService.isRegistered(this.config.matchPlayId, this._currentUser.member.id);
            }),
            map(isParticipant => {
                this._currentUser.member.matchplayParticipant = isParticipant;
                this.currentUserSource.next(this._currentUser);
                return;
            })
         ).subscribe(() => { return; }); // no-op - force the call
    }

    getUser(): Observable<User> {
        return this.dataService.getAuthRequest('user').pipe(
            map((data: any) => {
                return new User(data);
            }),
            catchError(() => {
                this.removeFromStorage('bhmc_token');
                return of(new User({}));
            })
        );
    }

    onError(message: string): void {
        if (message === 'Invalid token.') {
            this.resetUser();
        }
    }

    resetUser(): void {
        Cookie.delete('crsftoken');
        this.removeFromStorage('bhmc_token');
        this._currentUser = new User({});
        this.currentUserSource.next(this._currentUser);
        this.errorHandler.clearUserContext();
    }

    private getFromStorage(key: string, override: boolean = false): string {
        if (this._rememberUser || override) {
            return localStorage.getItem(key) || '';
        }
        return sessionStorage.getItem(key) || '';
    }

    private saveToStorage(key: string, data: string, override: boolean = false): void {
        if (this._rememberUser || override) {
            localStorage.setItem(key, data);
        } else {
            sessionStorage.setItem(key, data);
        }
    }

    private removeFromStorage(key: string, override: boolean = false): void {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    }
}
