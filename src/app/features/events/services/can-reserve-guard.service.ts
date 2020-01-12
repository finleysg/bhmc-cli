import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthenticationService, BhmcErrorHandler, RegistrationService } from '../../../core';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class CanReserveGuard implements CanActivate {

    constructor(
        private registrationService: RegistrationService,
        private authService: AuthenticationService,
        private errorHandler: BhmcErrorHandler,
        private router: Router) { }

    static eventIdFromUrl(url: string): number {
        let id = 0;
        const segments = url.split('/');
        for (let i = 0; i < segments.length; i++) {
            if (segments[i] === 'events') {
                id = +segments[i + 1];
                break;
            }
        }
        return id;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

        const eventId = CanReserveGuard.eventIdFromUrl(state.url);
        if (!eventId) {
            this.errorHandler.logWarning(`No event id could be parsed from ${state.url}`);
            return of(false);
        }

        return this.registrationService.isRegistered(+eventId, this.authService.user.member.id).pipe(
            map(result => {
                if (result) {
                    this.errorHandler.logWarning(`Event ${eventId}: member ${this.authService.user.member.id} is already registered`);
                    // events/123/registered/1
                    this.router.navigate(['/events', eventId, 'registered', 1]);
                    return false;
                }
                return true;
            }),
            catchError(() => {
                return of(false);
            })
        );
    }
}
