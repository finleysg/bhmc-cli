import { MemberModule } from './features/member/member.module';
import { HomeModule } from './home/home.module';
import { PoliciesModule } from './features/policies/policies.module';
import { ResultsModule } from './features/results/results.module';
import { EventsModule } from './features/events/events.module';
import { DirectoryModule } from './features/directory/directory.module';
import { ContactModule } from './features/contact/contact.module';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { AppRoutingModule } from './app-routing.module';
import { BhmcCoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { CalendarModule } from './features/calendar/calendar.module';
import { BhmcErrorHandler } from './core/services/bhmc-error-handler.service';
import { ConfigService, ConfigLoader } from './app-config.service';
import { SeasonPointsModule } from './features/season-points/season-points.module';
import { DamCupModule } from './features/dam-cup/dam-cup.module';
import { ReportingModule } from './features/reporting/reporting.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BhmcCoreModule,
    SharedModule,
    LayoutModule,
    HomeModule,
    MemberModule,
    ContactModule,
    DirectoryModule,
    EventsModule,
    ResultsModule,
    PoliciesModule,
    CalendarModule,
    SeasonPointsModule,
    DamCupModule,
    ReportingModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: BhmcErrorHandler },
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
export class AppModule { }
