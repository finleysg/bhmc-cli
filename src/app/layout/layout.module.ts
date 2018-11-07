import { NgModule } from '@angular/core';
import { PageHeaderComponent } from './page-header/page-header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChangeLayoutDirective } from './page-header/change-layout.directive';
import { ToggleSubmenuDirective } from './sidebar/toggle-submenu.directive';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { SharedModule } from '../shared/shared.module';
import { ToasterModule } from 'angular2-toaster';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';

@NgModule({
    imports: [
        RouterModule,
        SharedModule,
        ToasterModule.forRoot(),
        NgProgressModule.forRoot(),
        NgProgressHttpModule.forRoot()
    ],
    declarations: [
        LayoutComponent,
        PageHeaderComponent,
        SidebarComponent,
        ChangeLayoutDirective,
        ToggleSubmenuDirective
    ],
    exports: [
        LayoutComponent
    ]
})
export class LayoutModule {
}
