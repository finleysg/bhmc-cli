import { User } from '../models/user';
import { AuthenticationService } from './authentication.service';
import { Injectable }       from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
}                           from '@angular/router';
import { BhmcErrorHandler } from './bhmc-error-handler.service';

@Injectable()
export class AuthGuard implements CanActivate {

    private currentUser: User;

    constructor(
        private authService: AuthenticationService,
        private errorHandler: BhmcErrorHandler,
        private router: Router) {
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        // Store the attempted URL for redirecting
        this.authService.redirectUrl = state.url;

        if (this.currentUser.isAuthenticated) { return true; }

        // Navigate to the login page
        this.errorHandler.logWarning(`Unauthorized user tried to reach ${state.url}`);
        this.router.navigate(['/member/login']);
        return false;
    }
}
