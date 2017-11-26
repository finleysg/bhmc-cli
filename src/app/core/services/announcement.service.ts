import { Injectable } from '@angular/core';
import { BhmcDataService } from './bhmc-data.service';
import { Observable } from 'rxjs/Observable';
import { Announcement } from '../models/announcement';
import { map } from 'rxjs/operators';

@Injectable()
export class AnnouncementService {

    constructor(private dataService: BhmcDataService) {  }

    currentAnnouncements(): Observable<Announcement[]> {
        return this.dataService.getApiRequest('announcements').pipe(
            map(announcements => {
                return announcements.map((a: any) => {
                    return new Announcement().fromJson(a);
                });
            })
        );
    }
}
