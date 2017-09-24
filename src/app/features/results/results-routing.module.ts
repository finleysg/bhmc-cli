import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MajorResultsComponent } from './major/major-results.component';
import { LeagueResultsComponent } from './league/league-results.component';

const routes: Routes = [
    { path: 'results', children: [
        { path: 'league', component: LeagueResultsComponent },
        { path: 'majors', component: MajorResultsComponent }
    ]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResultsRoutingModule {
}
