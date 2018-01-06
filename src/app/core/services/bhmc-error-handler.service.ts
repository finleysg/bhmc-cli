import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '../../app-config.service';
import { AppConfig } from '../../app-config';
import { User } from '../models/user';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as Raven from 'raven-js';

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
        if (!this.config.isLocal) {
            const options = { 'release': configService.config.version, 'autoBreadcrumbs': { 'xhr': false }};
            Raven
                .config(this.config.ravenDsn, options)
                .install();
        }
    }

    setUserContext(user: User): void {
        if (this.config.isLocal) { return; }
        if (user.isAuthenticated) {
            Raven.setUserContext({
                username: user.name,
                email: user.email
            });
        }
    }

    clearUserContext(): void {
        if (this.config.isLocal) { return; }
        Raven.setUserContext();
    }

    handleError(err: any): void {
        this.errorSource.next(err.message ? err.message : err.toString());
        if (this.config.isLocal) {
            super.handleError(err);
        } else {
            Raven.captureException(err.originalError);
        }
    }

    logError(err: any): void {
        this.errorSource.next(err.message ? err.message : err.toString());
        if (this.config.isLocal) {
            console.error(err.toString());
        } else {
            Raven.captureException(err);
        }
    }

    logResponse(message: string, response: HttpErrorResponse) {
        this.errorSource.next(message);
        if (this.config.isLocal) {
            // TODO: handle text or blob responses
            console.log(`${response.status}: ${JSON.stringify(response.error)}`);
        } else {
            const options: any = {
                level: 'error',
                extra: {
                    'message': response.message,
                    'error': response.error
                }
            };
            Raven.captureMessage(message, options);
        }
    }

    logWarning(message: string): void {
        if (this.config.isLocal) {
            console.warn(message);
        } else {
            Raven.captureMessage(message, {level: 'warning'});
        }
    }

    logMessage(message: string): void {
        if (this.config.isLocal) {
            console.log(message);
        }
    }
}
