import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MajorResultsComponent } from './major/major-results.component';
import { LeagueResultsComponent } from './league/league-results.component';
import { ResultsLandingComponent } from './results-landing.component';

const routes: Routes = [
    { path: '', component: ResultsLandingComponent, children: [
        { path: 'league', component: LeagueResultsComponent },
        { path: 'majors', component: MajorResultsComponent }
    ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResultsRoutingModule { }
