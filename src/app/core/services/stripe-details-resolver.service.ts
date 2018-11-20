import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { MemberService } from './member.service';
import { SavedCard } from '../models/saved-card';
import { Observable } from 'rxjs';

@Injectable()
export class StripeDetailsResolver implements Resolve<SavedCard> {

    constructor(private memberService: MemberService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SavedCard> {
        return this.memberService.stripeSavedCard();
    }
}
