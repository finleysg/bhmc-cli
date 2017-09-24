import { NgModule } from '@angular/core';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './contact.component';
import { SharedModule } from '../../shared/shared.module';
import { ContactService } from './contact.service';

@NgModule({
    imports: [
        ContactRoutingModule,
        SharedModule
    ],
    declarations: [
        ContactComponent
    ],
    providers: [
        ContactService
    ]
})
export class ContactModule {
}
