import { SharedModule } from '../../shared/shared.module';
import { CalendarRoutingModule } from './calendar-routing.module';
import { NgModule } from '@angular/core';

import { CalendarComponent }   from './calendar.component';

@NgModule({
    imports: [
        CalendarRoutingModule,
        SharedModule
    ],
    declarations:  [
        CalendarComponent]
})
export class CalendarModule { }
