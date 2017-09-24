import { PolicyService } from './policy.service';
import { NgModule } from '@angular/core';
import { PoliciesRoutingModule } from './policies-routing.module';
import { PoliciesComponent } from './policies.component';
import { SharedModule } from '../../shared/shared.module';
import { AboutUsComponent } from './about-us.component';

@NgModule({
    imports: [
        PoliciesRoutingModule,
        SharedModule
    ],
    declarations: [
        PoliciesComponent,
        AboutUsComponent
    ],
    providers: [
        PolicyService
    ]
})
export class PoliciesModule {
}
