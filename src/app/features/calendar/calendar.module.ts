import {SharedModule} from '../../shared/shared.module';
import {CalendarRoutingModule} from './calendar-routing.module';
import {NgModule} from '@angular/core';

import {CalendarComponent}   from './calendar.component';
import {CalendarLandingComponent} from "./calendar-landing.component";

@NgModule({
  imports: [
    CalendarRoutingModule,
    SharedModule
  ],
  declarations: [
    CalendarComponent,
    CalendarLandingComponent
  ]
})
export class CalendarModule {}
