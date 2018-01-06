import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BhmcErrorHandler } from './bhmc-error-handler.service';
import { catchError } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class InterceptorError implements HttpInterceptor {

    constructor(private errorHandler: BhmcErrorHandler) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(err => {
                return this.handleError(err);
            })
        );
    }

    handleError(err: any): Observable<any> {

        let message: string;
        if (err instanceof HttpErrorResponse) {
            if (err.status === 0) {
                message = `Could not reach the bhmc server because your internet connection 
                           was lost, the connection timed out, or the server is not responding.`;
            } else {
                const body = err.error || {};
                if (body.non_field_errors) {
                    // django-rest-auth
                    message = body.non_field_errors[0];
                } else if (body.username) {
                    // django-rest-auth
                    message = body.username[0];
                } else if (body.detail) {
                    // django-rest-framework
                    message = body.detail;
                } else {
                    message = JSON.stringify(body);
                }
            }
            this.errorHandler.logResponse(message, err);
        } else {
            this.errorHandler.logError(err);
            message = err.message ? err.message : err.toString();
        }

        return ErrorObservable.create(message);
    }
}
