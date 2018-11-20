import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SpinnerDirective } from './spinner/spinner.directive';
import { SpinnerService } from './spinner/spinner.service';
import { SpinnerButtonComponent } from './spinner/spinner-button.component';
import { MarkdownDirective } from './markdown/markdown.directive';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TimerComponent } from './timer/timer.component';
import { PaymentComponent } from './payments/payment.component';
import { UploadComponent } from './upload/upload.component';
import { OfflineRegistrationComponent } from './offline-register/offline-registration.component';
import { OfflineRegistrationForm } from './offline-register/offline-registration-form.service';
import { DownloadCsvComponent } from './download/download-csv.component';
import { ChargeComponent } from './payments/charge.component';
import { CreditCardFormatDirective } from './payments/credit-card-format.directive';
import { ExpiryFormatDirective } from './payments/expiry-format.directive';
import { CvcFormatDirective } from './payments/cvc-format.directive';
import { CreditCardService } from './payments/credit-card.service';
import { CreditCardForm } from './payments/credit-card.form';
import { PortalComponent } from './portal/portal.component';
import { SavedCardComponent } from './payments/saved-card.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TypeaheadModule.forRoot(),
        ModalModule.forRoot(),
        BsDropdownModule.forRoot()
    ],
    declarations: [
        PaymentComponent,
        SpinnerDirective,
        SpinnerButtonComponent,
        MarkdownDirective,
        TimerComponent,
        UploadComponent,
        PortalComponent,
        OfflineRegistrationComponent,
        DownloadCsvComponent,
        ChargeComponent,
        CreditCardFormatDirective,
        ExpiryFormatDirective,
        CvcFormatDirective,
        SavedCardComponent
    ],
    providers: [
        SpinnerService,
        OfflineRegistrationForm,
        CreditCardService,
        CreditCardForm,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        SpinnerDirective,
        SpinnerButtonComponent,
        MarkdownDirective,
        TimerComponent,
        TypeaheadModule,
        ModalModule,
        BsDropdownModule,
        PaymentComponent,
        UploadComponent,
        PortalComponent,
        OfflineRegistrationComponent,
        DownloadCsvComponent,
        ChargeComponent,
        SavedCardComponent
    ]
})
export class SharedModule { }
