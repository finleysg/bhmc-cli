import { Injectable } from '@angular/core';
import { BhmcDataService } from './bhmc-data.service';
import { Sponsor } from '../models/sponsor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SponsorService {

    constructor(private dataService: BhmcDataService) {  }

    getSponsors(): Observable<Sponsor[]> {
        return this.dataService.getApiRequest('sponsors').pipe(
            map(sponsors => {
                return sponsors.map((s: any) => {
                    return new Sponsor().fromJson(s);
                });
            })
        );
    }
}
