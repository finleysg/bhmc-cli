import { Injectable } from '@angular/core';
import { PublicMember } from '../models/member';
import { BhmcDataService } from './bhmc-data.service';
import { Observable } from 'rxjs/Observable';
import { SavedCard } from '../models/saved-card';
import { map } from 'rxjs/operators';

@Injectable()
export class MemberService {

    constructor(private dataService: BhmcDataService) {}

    getMembers(): Observable<PublicMember[]> {
        return this.dataService.getApiRequest('members').pipe(
            map( members => {
                return members.map((m: any) => {
                    return new PublicMember().fromJson(m);
                });
            })
        );
    }

    getRegisteredMembers(): Observable<PublicMember[]> {
        return this.dataService.getApiRequest('members', {'registered': true}).pipe(
            map( members => {
                return members.map((m: any) => {
                    return new PublicMember().fromJson(m);
                });
            })
        );
    }

    isRegistered(eventId: number, memberId: number): Observable<boolean> {
        return this.dataService.getApiRequest(`registration/${eventId}/${memberId}`).pipe(
            map( answer => {
                return !!answer.registered;
            })
        );
    }

    getMember(id: number): Observable<PublicMember> {
        return this.dataService.getApiRequest(`members/${id}`).pipe(
            map( m => new PublicMember().fromJson(m) )
        );
    }

    friends(): Observable<PublicMember[]> {
        return this.dataService.getApiRequest('friends').pipe(
            map( members => {
                return members.map((m: any) => {
                    return new PublicMember().fromJson(m);
                });
            })
        );
    }

    addFriend(member: PublicMember): Observable<void> {
        return this.dataService.postApiRequest(`friends/add/${member.id}`, {});
    }

    removeFriend(member: PublicMember): Observable<void> {
        return this.dataService.postApiRequest(`friends/remove/${member.id}`, {});
    }

    stripeSavedCard(): Observable<SavedCard> {
        return this.dataService.getApiRequest('stripe/details').pipe(
            map(data => {
                return new SavedCard().fromJson(data);
            })
        );
    }
}
