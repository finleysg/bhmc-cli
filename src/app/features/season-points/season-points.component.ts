import { Component, OnInit, ViewChild } from '@angular/core';
import { EventDocument, DocumentService, DocumentType, User, AuthenticationService } from '../../core';
import { ConfigService } from '../../app-config.service';
import { UploadComponent } from '../../shared/upload/upload.component';

@Component({
    moduleId: module.id,
    templateUrl: 'season-points.component.html',
    styleUrls: ['season-points.component.css']
})
export class SeasonPointsComponent implements OnInit {

    @ViewChild(UploadComponent) uploadComponent: UploadComponent;

    currentUser: User;
    archives: EventDocument[];
    documentType: DocumentType = DocumentType.SeasonPoints;

    currentStandingsGross: EventDocument;
    currentStandingsNet: EventDocument;

    constructor(
        private configService: ConfigService,
        private authService: AuthenticationService,
        private documentService: DocumentService
    ) {
    }

    ngOnInit(): void {
        this.currentUser = this.authService.user;
        this.documentService.getDocuments(DocumentType.SeasonPoints)
            .subscribe(docs => {
                const current = docs.filter(d => d.year === this.configService.config.year);
                this.archives = docs.filter(d => d.year !== this.configService.config.year);
                if (current && current.length > 0) {
                    this.currentStandingsGross = current.filter(c => c.title.indexOf('Gross') > 0)[0];
                    this.currentStandingsNet = current.filter(c => c.title.indexOf('Net') > 0)[0];
                }
            });
    }

    editGross() {
        this.uploadComponent.open(this.currentStandingsGross, 'Gross');
    }

    editNet() {
        this.uploadComponent.open(this.currentStandingsNet, 'Net');
    }

    uploadComplete(result: EventDocument): void {
        if (result && result.title.indexOf('Gross') > 0) {
            this.currentStandingsGross = result;
        } else if (result && result.title.indexOf('Net') > 0) {
            this.currentStandingsNet = result;
        }
    }
}
