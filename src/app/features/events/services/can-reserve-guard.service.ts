import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService, BhmcErrorHandler, RegistrationService } from '../../../core';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Injectable()
export class CanReserveGuard implements CanActivate {

    constructor(
        private registrationService: RegistrationService,
        private authService: AuthenticationService,
        private errorHandler: BhmcErrorHandler,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

        const eventId = route.pathFromRoot[1].url[1].path;

        return this.registrationService.isRegistered(+eventId, this.authService.user.member.id).pipe(
            map(result => {
                if (result) {
                    this.errorHandler.logWarning(`Event ${eventId}: member ${this.authService.user.member.id} is already registered`);
                    this.router.navigate(['/events', eventId, 'detail']);
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
