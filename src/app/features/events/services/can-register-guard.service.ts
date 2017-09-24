import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { BhmcErrorHandler, RegistrationService } from '../../../core';

@Injectable()
export class CanRegisterGuard implements CanActivate {

    constructor(
        private errorHandler: BhmcErrorHandler,
        private router: Router,
        private registrationService: RegistrationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        let result = true;
        const group = this.registrationService.currentGroup;

        if (!group) {
            this.errorHandler.logWarning('Missing group when trying to reach register page');
            result = false;
        } else if (group.hasExpired()) {
            this.errorHandler.logWarning(`Reservation has expired for group ${group.id}`);
            this.registrationService.cancelReservation(group);
            result = false;
        } else if (!group.registrations || group.registrations.length === 0) {
            // This is highly unlikely
            this.errorHandler.logWarning(`Group ${group.id} has no registration records`);
            result = false;
        } else if (group.paymentConfirmationCode) {
            // This should be impossible
            this.errorHandler.logWarning(`Group ${group.id} has already registered and paid: ${group.paymentConfirmationCode}`);
            result = false;
        }

        if (!result) {
            const eventId = route.parent.url[1].path;
            if (eventId) {
                this.router.navigate(['/events', eventId, 'detail']);
            } else {
                this.router.navigate(['/home']);
            }
        }
        return result;
    }
}
