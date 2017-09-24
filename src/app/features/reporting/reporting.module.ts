import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ReportLandingComponent } from './report-landing.component';
import { ReportingRoutingModule } from './reporting-routing.module';

@NgModule({
    imports: [
        ReportingRoutingModule,
        SharedModule
    ],
    declarations: [
        ReportLandingComponent,
    ]
})
export class ReportingModule {
}
