import { CalendarService } from './services/calendar.service';
import { AuthGuard } from './services/auth-guard.service';
import { NgModule } from '@angular/core';
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
import { PolicyService } from "./services/policy.service";
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientXsrfModule } from '@angular/common/http';
import { InterceptorApi } from './services/interceptor-api.service';
import { InterceptorAuth } from './services/interceptor-auth.service';
import { InterceptorError } from './services/interceptor-error.service';
import { InterceptorProgress } from './services/interceptor-progress.service';
import { HttpModule } from '@angular/http';
import { AnonGuard } from './services/anon-guard.service';

@NgModule({
    imports: [
        HttpModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken',
        })
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
        AnonGuard,
        CanDeactivateGuard,
        BhmcErrorHandler,
        StripeDetailsResolver,
        AnnouncementService,
        EventDetailService,
        EventDetailResolver,
        DocumentService,
        RegistrationService,
        SponsorService,
        PolicyService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorApi,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorAuth,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorError,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorProgress,
            multi: true
        }
    ]
})
export class BhmcCoreModule {}
