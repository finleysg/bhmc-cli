import { AppConfig } from '../../../app-config';
import { ConfigService } from '../../../app-config.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { User, AuthenticationService, EventDetail, EventDocument, DocumentType, DocumentService } from '../../../core';
import { ActivatedRoute } from '@angular/router';
import { UploadComponent } from '../../../shared/upload/upload.component';
declare const moment: any;

@Component({
    moduleId: module.id,
    templateUrl: 'match-play.component.html',
    styleUrls: ['match-play.component.css']
})
export class MatchPlayComponent implements OnInit {

    @ViewChild(UploadComponent) uploadComponent: UploadComponent;

    public eventDetail: EventDetail;
    public currentUser: User;
    public application: EventDocument;
    public canRegister: boolean;
    public config: AppConfig;
    public archives: EventDocument[]; // TODO: do we have past season results?
    public currentBrackets: EventDocument;
    public documentType: DocumentType = DocumentType.MatchPlay;

    constructor(private route: ActivatedRoute,
                private configService: ConfigService,
                private documentService: DocumentService,
                private authService: AuthenticationService) {
    }

    ngOnInit(): void {
        this.currentUser = this.authService.user;
        this.config = this.configService.config;
        this.route.data
            .subscribe((data: { eventDetail: EventDetail }) => {
                this.eventDetail = data.eventDetail;
                this.application = this.eventDetail.getDocument(DocumentType.SignUp);
                this.canRegister = this.currentUser.isAuthenticated && this.eventDetail.signupEnd.isAfter(moment()) && !this.currentUser.member.matchplayParticipant;
            });
        this.documentService.getDocuments(this.documentType)
            .subscribe(docs => {
                let current = docs.filter(d => d.year === this.configService.config.year && d.title.indexOf('Brackets') > 0);
                this.archives = docs.filter(d => d.year !== this.configService.config.year && d.title.indexOf('Brackets') > 0);
                if (current && current.length > 0) {
                    this.currentBrackets = current[0];
                }
            });
    }

    uploadBrackets(): void {
        this.uploadComponent.open(this.currentBrackets);
    }

    uploadComplete(result: EventDocument): void {
        if (result) {
            this.currentBrackets = result;
        }
    }
}
