import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { AuthenticationService, BhmcErrorHandler, RegistrationService } from '../../../core';

@Injectable()
export class CanReserveGuard implements CanActivate {

    constructor(
        private registrationService: RegistrationService,
        private authService: AuthenticationService,
        private errorHandler: BhmcErrorHandler,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {

        const eventId = route.pathFromRoot[1].url[1].path;

        return this.registrationService.isRegistered(+eventId, this.authService.user.member.id)
            .then(result => {
                if (result) {
                    this.errorHandler.logWarning(`Event ${eventId}: member ${this.authService.user.member.id} is already registered`);
                    this.router.navigate(['/events', eventId, 'detail']);
                    return false;
                }
                return true;
            });
    }
}
