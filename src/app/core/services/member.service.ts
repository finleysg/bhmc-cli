import { Injectable } from '@angular/core';
import { PublicMember } from '../models/member';
import { BhmcDataService } from './bhmc-data.service';
import { Observable } from 'rxjs/Observable';
import { SavedCard } from '../models/saved-card';

@Injectable()
export class MemberService {

    constructor(private dataService: BhmcDataService) {}

    getMembers(): Observable<PublicMember[]> {
        return this.dataService.getApiRequest('members').map( members => {
            return members.map((m: any) => {
                return new PublicMember().fromJson(m);
            });
        });
    }

    getRegisteredMembers(): Observable<PublicMember[]> {
        return this.dataService.getApiRequest('members', {'registered': true}).map( members => {
            return members.map((m: any) => {
                return new PublicMember().fromJson(m);
            });
        });
    }

    isRegistered(eventId: number, memberId: number): Promise<boolean> {
        return this.dataService.getApiRequest(`registration/${eventId}/${memberId}`).map( answer => {
            return !!answer.registered;
        })
        .toPromise();
    }

    getMember(id: number): Observable<PublicMember> {
        return this.dataService.getApiRequest(`members/${id}`).map( m => new PublicMember().fromJson(m));
    }

    friends(): Observable<PublicMember[]> {
        return this.dataService.getApiRequest('friends').map( members => {
            return members.map((m: any) => {
                return new PublicMember().fromJson(m);
            });
        });
    }

    addFriend(member: PublicMember): Promise<void> {
        return this.dataService.postApiRequest(`friends/add/${member.id}`, {}).toPromise();
    }

    removeFriend(member: PublicMember): Promise<void> {
        return this.dataService.postApiRequest(`friends/remove/${member.id}`, {}).toPromise();
    }

    stripeSavedCard(): Promise<SavedCard> {
        return this.dataService.getApiRequest('stripe/details').map(data => {
            return new SavedCard().fromJson(data);
        })
        .toPromise();
    }
}
