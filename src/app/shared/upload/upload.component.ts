import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DocumentType, DocumentService, EventDetail, EventDocument } from '../../core';
import { AppConfig } from '../../app-config';
import { ConfigService } from '../../app-config.service';
import { ToasterService } from 'angular2-toaster';

declare const Spinner: any;

@Component({
    moduleId: module.id,
    selector: 'upload',
    templateUrl: 'upload.component.html',
    styleUrls: ['upload.component.css']
})
export class UploadComponent implements OnInit {

    @Input() documentType: DocumentType;
    @Input() eventDetail: EventDetail;
    @Output() onClose = new EventEmitter<EventDocument>();
    @ViewChild('uploadModal', { static: true }) uploadModal: ModalDirective;

    selectedFile: File;
    documentName: string;

    private existingDocument: EventDocument;
    private titleSuffix: string;
    private config: AppConfig;
    private spinner: any;
    private spinnerElement: any;
  
    constructor(
        private documentService: DocumentService,
        private elementRef: ElementRef,
        private configService: ConfigService,
        private toaster: ToasterService
    ) {
        this.config = configService.config;
    }

    ngOnInit() {
      this.initSpinner();
    }

    open(document: EventDocument, titleSuffix: string = null): void {
        this.existingDocument = document;
        this.titleSuffix = titleSuffix;
        this.documentName = this.deriveDocumentTitle();
        //noinspection TypeScriptValidateTypes
        this.uploadModal.config = {backdrop: 'static', keyboard: false};
        this.uploadModal.show();
    }

    openType(document: EventDocument, type: DocumentType): void {
        this.existingDocument = document;
        this.documentType = type;
        this.documentName = this.deriveDocumentTitle();
        //noinspection TypeScriptValidateTypes
        this.uploadModal.config = {backdrop: 'static', keyboard: false};
        this.uploadModal.show();
    }

    onShown(): void {
        this.spinnerElement = this.elementRef.nativeElement.querySelector('#spinner-span');
    }

    cancelUpload(): void {
        this.clearFile();
        this.onClose.emit(null);
        this.uploadModal.hide();
    }

    fileSelected($event: any): void {
        this.selectedFile = $event.target.files[0];
    }

    clearFile(): void {
        this.selectedFile = null;
    }

    uploadDocument(): void {
        let id = 0;
        let form: FormData;
        this.spinner.spin(this.spinnerElement);
        if (this.existingDocument) {
            id = this.existingDocument.id;
            form = this.updateDocument();
        } else {
            form = this.createDocument();
        }
        this.documentService.uploadDocument(form, id).subscribe(
            (doc: EventDocument) => {
                this.onClose.emit(doc);
                this.uploadModal.hide();
                this.spinner.stop();
                this.clearFile();
            },
            (err: string) => {
                this.spinner.stop();
                this.toaster.pop('error', 'Upload Failed', err);
            }
        );
    }

    private createDocument(): FormData {
        const form = new FormData();
        form.append('document_type', EventDocument.getDocumentCode(this.documentType));
        form.append('year', this.configService.config.year.toString());
        form.append('title', this.documentName);
        form.append('file', this.selectedFile, this.selectedFile.name);
        if (this.eventDetail) {
            form.append('event', this.eventDetail.id.toString());
        }
        form.append('display_flag', 'false');
        return form;
    }

    private updateDocument(): FormData {
        const form = new FormData();
        form.append('document_type', EventDocument.getDocumentCode(this.existingDocument.type));
        form.append('year', this.existingDocument.year.toString());
        form.append('title', this.existingDocument.title);
        form.append('file', this.selectedFile, this.selectedFile.name);
        if (this.eventDetail) {
            form.append('event', this.eventDetail.id.toString());
        }
        form.append('display_flag', this.existingDocument.displayFlag ? this.existingDocument.displayFlag.toString() : 'false');
        return form;
    }

    private deriveDocumentTitle(): string {
        let title: string;
        if (!this.existingDocument) {
            const year: number = this.config.year;
            switch (this.documentType) {
                case DocumentType.DamCup:
                    title = `${year} Dam Cup Standings`;
                    break;
                case DocumentType.MatchPlay:
                    title = `${year} Match Play Brackets`;
                    break;
                case DocumentType.Results:
                    title = `${this.eventDetail.startDate.format('YYYY-MM-DD')} Results (${this.eventDetail.name})`;
                    break;
                case DocumentType.SeasonPoints:
                    title = `${year} Season Long Points ${this.titleSuffix}`; // Net or Gross
                    break;
                case DocumentType.Teetimes:
                    title = `${this.eventDetail.startDate.format('YYYY-MM-DD')} ${this.eventDetail.name} Teetimes`;
                    break;
                default:
                    title = 'unknown';
                    break;
            }
        } else {
            title = this.existingDocument.title;
        }
        return title;
    }

    private initSpinner() {
        const options = {
            lines: 17,
            length: 0,
            width: 10,
            radius: 25,
            scale: 0.5,
            corners: 1.0,
            color: '#fff',
            opacity: 0.05,
            rotate: 0,
            direction: 1,
            speed: 0.7,
            trail: 60,
            zIndex: 2e9, // Artificially high z-index to keep on top
        };
        this.spinner = new Spinner(options);
    }
}
