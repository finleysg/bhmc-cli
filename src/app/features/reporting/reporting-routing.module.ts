import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportLandingComponent } from './report-landing.component';

const routes: Routes = [
    { path: 'admin/reporting', component: ReportLandingComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportingRoutingModule {
}
