import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { EventDetail, EventDetailService } from '../../core';
import { ToasterService } from 'angular2-toaster';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'portal',
    templateUrl: 'portal.component.html',
    styleUrls: ['portal.component.css']
})
export class PortalComponent implements OnInit {

    @Input() eventDetail!: EventDetail;
    @Output() onClose = new EventEmitter<void>();
    @ViewChild('portalModal', { static: true }) portalModal?: ModalDirective;

    constructor(
        private eventService: EventDetailService,
        private toaster: ToasterService
    ) {
    }

    ngOnInit() {
    }

    open(): void {
        //noinspection TypeScriptValidateTypes
        if (this.portalModal) {
            this.portalModal.config = {backdrop: 'static', keyboard: false};
            this.portalModal.show();
        }
    }

    cancelPortal(): void {
        this.clearUrl();
        this.onClose.emit();
        // tslint:disable-next-line: no-non-null-assertion
        this.portalModal!.hide();
    }

    clearUrl(): void {
        if (this.eventDetail) {
            this.eventDetail.portalUrl = '';
        }
    }

    savePortal(): void {
        if (this.eventDetail) {
            this.eventService.updateEventPortal(this.eventDetail).subscribe(
                (eventDetail: EventDetail) => {
                    this.eventDetail = eventDetail;
                    this.onClose.emit();
                    // tslint:disable-next-line: no-non-null-assertion
                    this.portalModal!.hide();
                    this.clearUrl();
                },
                (err: string) => {
                    this.toaster.pop('error', 'Portal Update Failed', err);
                }
            );
        }
    }
}
