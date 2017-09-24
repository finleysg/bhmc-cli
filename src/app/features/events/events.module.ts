import { ReserveComponent } from './reserve/reserve.component';
import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { EventsRoutingModule } from './events-routing.module';
import { EventComponent } from './detail/event.component';
import { ReserveTableComponent } from './reserve/reserve-table.component';
import { PaymentTestComponent } from './test/payment-test.component';
import { RegisteredComponent } from './register/registered.component';
import { ReadonlyTableComponent } from './register/readonly-table.component';
import { SeasonSignupComponent } from './register/season-signup.component';
import { MatchPlaySignupComponent } from './match-play/matchplay-signup.component';
import { MatchPlayComponent } from './match-play/match-play.component';
import { CanRegisterGuard } from './services/can-register-guard.service';
import { CanReserveGuard } from './services/can-reserve-guard.service';
import { MatchPlayGuard } from './services/matchplay-guard.service';
import { EventReportComponent } from './reports/event-report.component';
import { MatchplayReportComponent } from './reports/matchplay-report.component';
import { CheckInReportComponent } from './reports/check-in-report.component';
import { ReconciliationReportComponent } from './reports/reconciliation-report.component';
import { CheckInComponent } from './checkin/check-in.component';

@NgModule({
    imports: [
        EventsRoutingModule,
        SharedModule
    ],
    declarations: [
        EventComponent,
        EventReportComponent,
        RegisterComponent,
        ReserveComponent,
        ReserveTableComponent,
        PaymentTestComponent,
        RegisteredComponent,
        ReadonlyTableComponent,
        SeasonSignupComponent,
        MatchPlayComponent,
        MatchPlaySignupComponent,
        MatchplayReportComponent,
        CheckInReportComponent,
        ReconciliationReportComponent,
        CheckInComponent
    ],
    providers: [
        CanReserveGuard,
        CanRegisterGuard,
        MatchPlayGuard
    ]
})
export class EventsModule { }
