import { EventDetailService } from './event-detail.service';
import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { EventDetail, RegistrationWindowType } from '../models/event-detail';
import { BhmcErrorHandler } from './bhmc-error-handler.service';
import { map, catchError } from 'rxjs/operators';
import { Observable ,  of } from 'rxjs';

@Injectable()
export class EventDetailResolver implements Resolve<EventDetail> {

    constructor(
        private eventService: EventDetailService,
        private errorHandler: BhmcErrorHandler,
        private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EventDetail> {
        let id = route.params['id'];
        return this.eventService.getEventDetail(id).pipe(
            map(evt => {
                if (EventDetailResolver.isReserveRoute(route)) {
                    // A CanActivate guard didn't work because we don't have an event detail yet (guard ordering issue)
                    if (evt.registrationWindow !== RegistrationWindowType.Registering) {
                        this.errorHandler.logWarning(`Event ${id} is not in its registration window`);
                        this.router.navigate(['/']);
                        return of(null);
                    }
                }
                return evt;
            }),
            catchError((err: any) => {
                this.errorHandler.logError(err);
                this.errorHandler.logWarning(`Event ${id} was not found during event detail resolve`);
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
    
    static isReserveRoute(route: ActivatedRouteSnapshot): boolean {
        let result = false;
        if (route.children && 
            route.children[0] &&
            route.children[0].url &&
            route.children[0].url[0] &&
            route.children[0].url[0].path === 'reserve') {
            result = true;
        }
        return result;
    }
}
