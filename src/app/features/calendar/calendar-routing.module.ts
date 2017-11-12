import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CalendarComponent} from './calendar.component';
import {CalendarLandingComponent} from "./calendar-landing.component";

const routes:Routes = [
  {
    path: '', component: CalendarLandingComponent, children: [
      { path: ':year/:month', component: CalendarComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule {
}
