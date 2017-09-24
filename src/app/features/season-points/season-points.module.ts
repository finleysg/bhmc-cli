import { NgModule } from '@angular/core';
import { SeasonPointsComponent } from './season-points.component';
import { SharedModule } from '../../shared/shared.module';
import { SeasonPointsRoutingModule } from './season-points-routing.module';

@NgModule({
    imports: [
        SeasonPointsRoutingModule,
        SharedModule
    ],
    declarations: [
        SeasonPointsComponent
    ]
})
export class SeasonPointsModule {
}
