import { ReserveComponent } from './reserve/reserve.component';
import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from './detail/event.component';
import { ReserveTableComponent } from './reserve/reserve-table.component';
import { PaymentTestComponent } from './test/payment-test.component';
import { RegisteredComponent } from './register/registered.component';
import { ReadonlyTableComponent } from './register/readonly-table.component';
import { AuthGuard, CanDeactivateGuard, EventDetailResolver } from '../../core';
import { CanRegisterGuard } from './services/can-register-guard.service';
import { SeasonSignupComponent } from './register/season-signup.component';
import { MatchPlaySignupComponent } from './match-play/matchplay-signup.component';
import { MatchPlayComponent } from './match-play/match-play.component';
import { CanReserveGuard } from './services/can-reserve-guard.service';
import { MatchPlayGuard } from './services/matchplay-guard.service';
import { EventReportComponent } from './reports/event-report.component';
import { MatchplayReportComponent } from './reports/matchplay-report.component';
import { CheckInReportComponent } from './reports/check-in-report.component';
import { ReconciliationReportComponent } from './reports/reconciliation-report.component';
import { CheckInComponent } from './checkin/check-in.component';

const routes: Routes = [
    { path: 'test', children: [
        { path: 'payments', component: PaymentTestComponent },
    ]},
    { path: 'events/:id', resolve: { eventDetail: EventDetailResolver }, children: [
        { path: 'check-in', component: CheckInComponent },
        { path: 'detail', component: EventComponent },
        { path: 'report', canActivate: [AuthGuard], component: EventReportComponent },
        { path: 'check-in-report', canActivate: [AuthGuard], component: CheckInReportComponent },
        { path: 'recon-report', canActivate: [AuthGuard], component: ReconciliationReportComponent },
        { path: 'register', canActivate: [AuthGuard, CanRegisterGuard], canDeactivate: [CanDeactivateGuard], component: RegisterComponent },
        { path: 'matchplay', component: MatchPlayComponent },
        { path: 'matchplay/register', canActivate: [AuthGuard, MatchPlayGuard], component: MatchPlaySignupComponent },
        { path: 'matchplay/report', canActivate: [AuthGuard], component: MatchplayReportComponent },
        { path: 'season-signup', canActivate: [AuthGuard], component: SeasonSignupComponent },
        { path: 'reserve', canActivate: [AuthGuard], component: ReserveComponent, children: [
            { path: ':course', canActivate: [CanReserveGuard], component: ReserveTableComponent }
        ]},
        { path: 'registered', component: RegisteredComponent, children: [
            { path: ':course', component: ReadonlyTableComponent }
        ]},
    ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EventsRoutingModule { }
