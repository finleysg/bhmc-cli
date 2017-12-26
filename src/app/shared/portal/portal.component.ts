import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { EventDetail, EventDetailService } from '../../core';
import { AppConfig } from '../../app-config';
import { ConfigService } from '../../app-config.service';
import { ToasterService } from 'angular2-toaster';

declare const Spinner: any;

@Component({
    selector: 'portal',
    templateUrl: 'portal.component.html',
    styleUrls: ['portal.component.css']
})
export class PortalComponent implements OnInit {

    @Input() eventDetail: EventDetail;
    @Output() onClose = new EventEmitter<void>();
    @ViewChild('portalModal') portalModal: ModalDirective;

    private config: AppConfig;
  
    constructor(
        private eventService: EventDetailService,
        private configService: ConfigService,
        private toaster: ToasterService
    ) {
        this.config = configService.config;
    }

    ngOnInit() {
    }

    open(): void {
        //noinspection TypeScriptValidateTypes
        this.portalModal.config = {backdrop: 'static', keyboard: false};
        this.portalModal.show();
    }

    cancelPortal(): void {
        this.clearUrl();
        this.onClose.emit(null);
        this.portalModal.hide();
    }

    clearUrl(): void {
        this.eventDetail.portalUrl = '';
    }

    savePortal(): void {
        this.eventService.updateEventPortal(this.eventDetail).subscribe(
            (eventDetail: EventDetail) => {
                this.eventDetail = eventDetail;
                this.onClose.emit();
                this.portalModal.hide();
                this.clearUrl();
            },
            (err: string) => {
                this.toaster.pop('error', 'Portal Update Failed', err);
            }
        );
    }
}
