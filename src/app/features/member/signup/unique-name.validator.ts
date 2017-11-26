import { FormControl, AsyncValidatorFn } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { NewMemberDataService, CheckType } from './new-member-data.service';
import { of } from 'rxjs/observable/of';
import { debounceTime, distinctUntilChanged, takeUntil, switchMap } from 'rxjs/operators';

export function uniqueNameValidator(valueType: CheckType, dataService: NewMemberDataService): AsyncValidatorFn {
    let changed$ = new Subject<any>();
    return (control: FormControl) => new Promise((resolve) => {
        changed$.next();
        if (!control.valueChanges) return of(null);
        return control.valueChanges.pipe(
            debounceTime(1000),
            distinctUntilChanged(),
            takeUntil(changed$),
            switchMap(value => dataService.exists(value, valueType))
        ).subscribe(result => { resolve(result); });
    });
}
