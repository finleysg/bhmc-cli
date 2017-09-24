import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { NgModule } from '@angular/core';

import { HomeComponent }   from './home.component';

@NgModule({
    imports: [
        HomeRoutingModule,
        SharedModule
    ],
    declarations:  [
        HomeComponent]
})
export class HomeModule { }
