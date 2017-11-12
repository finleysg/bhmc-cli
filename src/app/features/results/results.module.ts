import { NgModule } from '@angular/core';
import { ResultsRoutingModule } from './results-routing.module';
import { LeagueResultsComponent } from './league/league-results.component';
import { MajorResultsComponent } from './major/major-results.component';
import { SharedModule } from '../../shared/shared.module';
import { ArchivePipe } from './league/archive.pipe';
import { ResultsLandingComponent } from './results-landing.component';

@NgModule({
    imports: [
        ResultsRoutingModule,
        SharedModule
    ],
    declarations: [
        ResultsLandingComponent,
        LeagueResultsComponent,
        MajorResultsComponent,
        ArchivePipe,
    ]
})
export class ResultsModule { }
