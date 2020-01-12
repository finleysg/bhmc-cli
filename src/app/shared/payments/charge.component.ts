import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { StripeCharge } from '../../core';
import { AppConfig } from '../../app-config';
import { ConfigService } from '../../app-config.service';

@Component({
    moduleId: module.id,
    // tslint:disable-next-line:component-selector
    selector: 'charge',
    templateUrl: 'charge.component.html',
})
export class ChargeComponent implements OnInit {

    @Output() onClose = new EventEmitter<boolean>();
    @ViewChild('chargeModal', { static: true }) chargeModal?: ModalDirective;

    public charge: StripeCharge = new StripeCharge({});
    public stripeUrl?: string;
    private config: AppConfig;

    constructor(
        private configService: ConfigService
    ) {
        this.config = configService.config;
    }

    ngOnInit() {
        this.charge = new StripeCharge({});
    }

    open(charge: StripeCharge): void {
        this.charge = charge;
        this.stripeUrl = `${this.config.stripeUrl}/${this.charge.id}`;
        if (this.chargeModal) {
            this.chargeModal.show();
        }
    }

    opened(): void {
        if (this.charge) {
            console.log('opened');
        }
    }

    close(): void {
        if (this.chargeModal) {
            this.chargeModal.hide();
        }
        this.onClose.emit(true);
    }
}
