import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { AuthenticationService, BhmcErrorHandler } from '../../../core';
import { ConfigService } from '../../../app-config.service';

@Injectable()
export class MatchPlayGuard implements CanActivate {

    constructor(
        private authService: AuthenticationService,
        private configService: ConfigService,
        private errorHandler: BhmcErrorHandler,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (this.authService.user.member.matchplayParticipant) {
            this.errorHandler.logWarning(`Member ${this.authService.user.member.id} is already registered for match play`);
            this.router.navigate(['/events', this.configService.config.matchPlayId, 'matchplay']);
            return false;
        }
        return true;
    }
}
