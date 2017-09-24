import { NgModule } from '@angular/core';
import { DirectoryRoutingModule } from './directory-routing.module';
import { DirectoryComponent } from './directory.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        DirectoryRoutingModule,
        SharedModule
    ],
    declarations: [
        DirectoryComponent
    ]
})
export class DirectoryModule {
}
