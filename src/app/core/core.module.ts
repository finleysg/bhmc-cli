import { CalendarService } from './services/calendar.service';
import { AuthGuard } from './services/auth-guard.service';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { LayoutService } from './services/layout.service';
import { AuthenticationService } from './services/authentication.service';
import { BhmcDataService } from './services/bhmc-data.service';
import { MemberService } from './services/member.service';
import { DialogService } from './services/dialog.service';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { WindowRef } from './services/window-reference.service';
import { BhmcErrorHandler } from './services/bhmc-error-handler.service';
import { StripeDetailsResolver } from './services/stripe-details-resolver.service';
import { AnnouncementService } from './services/announcement.service';
import { EventDetailService } from './services/event-detail.service';
import { EventDetailResolver } from './services/event-detail-resolver.service';
import { DocumentService } from './services/document.service';
import { RegistrationService } from './services/registration.service';
import { SponsorService } from './services/sponsor.service';
import './rxjs-extensions';

@NgModule({
    imports: [
        HttpModule,
    ],
    providers: [
        LayoutService,
        BhmcDataService,
        AuthenticationService,
        MemberService,
        CalendarService,
        DialogService,
        WindowRef,
        AuthGuard,
        CanDeactivateGuard,
        BhmcErrorHandler,
        StripeDetailsResolver,
        AnnouncementService,
        EventDetailService,
        EventDetailResolver,
        DocumentService,
        RegistrationService,
        SponsorService
    ]
})
export class BhmcCoreModule {}
