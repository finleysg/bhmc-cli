import {NgModule, ErrorHandler, APP_INITIALIZER} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {LayoutModule} from './layout/layout.module';
import {AppRoutingModule} from './app-routing.module';
import {BhmcCoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {BhmcErrorHandler} from './core/services/bhmc-error-handler.service';
import {ConfigService, ConfigLoader} from './app-config.service';
import {ReportingModule} from './features/reporting/reporting.module';
import {HomeComponent} from './home/home.component';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        BhmcCoreModule,
        SharedModule,
        LayoutModule,
        ReportingModule
    ],
    declarations: [
        AppComponent,
        HomeComponent
    ],
    providers: [
        {provide: ErrorHandler, useClass: BhmcErrorHandler},
        ConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: ConfigLoader,
            deps: [ConfigService],
            multi: true
        }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
