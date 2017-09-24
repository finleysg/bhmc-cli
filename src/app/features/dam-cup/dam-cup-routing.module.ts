import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DamCupComponent } from './dam-cup.component';

const routes: Routes = [
    { path: 'dam-cup', component: DamCupComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DamCupRoutingModule {
}
