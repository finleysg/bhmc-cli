import { Observable } from 'rxjs';
import { BhmcDataService } from '../../core/services/bhmc-data.service';
import { Injectable } from '@angular/core';
import { Policy, PolicyCategory } from '../models/policy';
import { mergeAll, map, filter } from 'rxjs/operators';

@Injectable()
export class PolicyService {

    constructor(private dataService: BhmcDataService) { }

    loadPolicies(category: PolicyCategory): Observable<Policy> {
        return this.dataService.getApiRequest('policies').pipe(
            mergeAll(), // turn Observable<any> where any=collection into Observable
            map((p: any) => new Policy().fromJson(p)),
            filter((policy: Policy) => policy.category === category)
        );
    }
}
