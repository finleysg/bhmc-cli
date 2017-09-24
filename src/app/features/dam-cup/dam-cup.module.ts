import { NgModule } from '@angular/core';
import { DamCupComponent } from './dam-cup.component';
import { SharedModule } from '../../shared/shared.module';
import { DamCupRoutingModule } from './dam-cup-routing.module';

@NgModule({
    imports: [
        DamCupRoutingModule,
        SharedModule
    ],
    declarations: [
        DamCupComponent,
    ]
})
export class DamCupModule {
}
