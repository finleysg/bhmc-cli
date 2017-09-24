import { Injectable } from '@angular/core';
import { BhmcDataService } from './bhmc-data.service';
import { Sponsor } from '../models/sponsor';

@Injectable()
export class SponsorService {

    constructor(private dataService: BhmcDataService) {  }

    getSponsors(): Promise<Sponsor[]> {
        return this.dataService.getApiRequest('sponsors').map(sponsors => {
            return sponsors.map((s: any) => {
                return new Sponsor().fromJson(s);
            });
        }).toPromise();
    }
}
