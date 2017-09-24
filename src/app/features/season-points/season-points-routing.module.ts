import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeasonPointsComponent } from './season-points.component';

const routes: Routes = [
    { path: 'season-points', component: SeasonPointsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SeasonPointsRoutingModule {
}
