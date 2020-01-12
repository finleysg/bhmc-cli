import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '../../app-config.service';
import { AppConfig } from '../../app-config';
import { User } from '../models/user';
import { Observable ,  Subject } from 'rxjs';
import * as Sentry from '@sentry/browser';

@Injectable()
export class BhmcErrorHandler extends ErrorHandler {

    private errorSource: Subject<string>;
    public lastError$: Observable<string>;
    private config: AppConfig;

    constructor(
        private configService: ConfigService
    ) {
        super();
        this.errorSource = new Subject();
        this.lastError$ = this.errorSource.asObservable();
        this.config = configService.config;
        // if (!this.config.isLocal) {
            Sentry.init({
                dsn: this.config.ravenDsn
            });
        // }
    }

    setUserContext(user: User): void {
        // if (this.config.isLocal) { return; }
        if (user.isAuthenticated) {
            Sentry.setUser({
                username: user.name,
                email: user.email
            });
        }
    }

    clearUserContext(): void {
        // if (this.config.isLocal) { return; }
        Sentry.setUser({});
    }

    handleError(err: any): void {
        this.errorSource.next(err.message ? err.message : err.toString());
        // if (this.config.isLocal) {
        //     super.handleError(err);
        // } else {
            Sentry.captureException(err);
        // }
    }

    logError(err: any): void {
        this.errorSource.next(err.message ? err.message : err.toString());
        // if (this.config.isLocal) {
        //     console.error(err.toString());
        // } else {
            Sentry.captureException(err);
        // }
    }

    logResponse(message: string, response: HttpErrorResponse) {
        this.errorSource.next(message);
        if (this.config.isLocal) {
            // TODO: handle text or blob responses
            console.log(`${response.status}: ${JSON.stringify(response.error)}`);
        }
    }

    logWarning(message: string): void {
        // if (this.config.isLocal) {
        //     console.warn(message);
        // } else {
            Sentry.captureMessage(message);
        // }
    }

    logMessage(message: string): void {
        if (this.config.isLocal) {
            console.log(message);
        }
    }
}
