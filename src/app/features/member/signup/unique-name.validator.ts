import { FormControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { NewMemberDataService, CheckType } from './new-member-data.service';

export function uniqueNameValidator(valueType: CheckType, dataService: NewMemberDataService): AsyncValidatorFn {
    let changed$ = new Subject<any>();
    return (control: FormControl) => new Promise((resolve) => {
        changed$.next();
        if (!control.valueChanges) return Observable.of(null);
        return control
            .valueChanges
            .debounceTime(1000)
            .distinctUntilChanged()
            .takeUntil(changed$)
            .switchMap(value => dataService.exists(value, valueType))
            .subscribe(result => { resolve(result); });
    });
}
