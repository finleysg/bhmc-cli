import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService, User, EventDocument, DocumentType, SkinsType, StartType, EventDetailService,
    EventDetail, EventType, DialogService, RegistrationService, Sponsor, SponsorService } from '../../../core';
import { UploadComponent } from '../../../shared/upload/upload.component';
import { ToasterService } from 'angular2-toaster';

@Component({
    moduleId: module.id,
    templateUrl: 'event.component.html',
    styleUrls: ['event.component.css']
})
export class EventComponent implements OnInit {

    @ViewChild(UploadComponent) resultsUpload: UploadComponent;

    public eventDetail: EventDetail;
    public currentUser: User;
    public results: EventDocument;
    public teetimes: EventDocument;
    public hasSkins: boolean;
    public startType: string;
    public isRegistered: boolean;
    public isMajor: boolean;
    public goldSponsors: Sponsor[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private registrationService: RegistrationService,
        private toaster: ToasterService,
        private dialogService: DialogService,
        private eventService: EventDetailService,
        private sponsorService: SponsorService,
        private authService: AuthenticationService) { }

    ngOnInit(): void {
        this.isRegistered = false;
        this.currentUser = this.authService.user;
        this.route.data
            .subscribe((data: {eventDetail: EventDetail}) => {
                this.eventDetail = data.eventDetail;
                this.results = this.eventDetail.getDocument(DocumentType.Results);
                this.teetimes = this.eventDetail.getDocument(DocumentType.Teetimes);
                this.hasSkins = this.eventDetail.skinsType !== SkinsType.None;
                this.isMajor = this.eventDetail.eventType === EventType.Major;
                if (this.eventDetail.startType != StartType.NA) {
                    this.startType = this.eventDetail.startType.toString();
                }
                this.registrationService.isRegistered(this.eventDetail.id, this.currentUser.member.id)
                    .then(registered => {
                        this.isRegistered = registered;
                    });
            });
        this.sponsorService.getSponsors().then(sponsors => {
            this.goldSponsors = sponsors.filter(s => s.level === 'G');
        });
    }

    canRegister(): boolean {
        return this.eventDetail.canRegister &&
            this.currentUser.isAuthenticated &&
            this.currentUser.member.membershipIsCurrent &&
            !this.isRegistered;
    }

    register(): void {
        if (this.eventDetail.eventType === EventType.League) {
            this.router.navigate(['reserve'], {relativeTo: this.route.parent});
        } else {
            this.registrationService.reserve(this.eventDetail.id).then(() => {
                this.router.navigate(['register'], {relativeTo: this.route.parent});
            });
       }
    }

    registered(): void {
        this.router.navigate(['registered'], {relativeTo: this.route.parent});
    }

    eventReport(): void {
        this.router.navigate(['report'], {relativeTo: this.route.parent});
    }

    checkInReport(): void {
        this.router.navigate(['check-in-report'], {relativeTo: this.route.parent});
    }

    reconReport(): void {
        this.router.navigate(['recon-report'], {relativeTo: this.route.parent});
    }

    uploadResults(): void {
        this.resultsUpload.openType(this.results, DocumentType.Results);
    }

    uploadTeetimes(): void {
        this.resultsUpload.openType(this.teetimes, DocumentType.Teetimes);
    }

    checkIn(): void {
        this.router.navigate(['check-in'], {relativeTo: this.route.parent});
    }

    uploadComplete(doc: EventDocument): void {
        this.eventService.refreshEventDetail().then(() => {
            if (doc.type === DocumentType.Results) {
                this.results = doc;
            } else {
                this.teetimes = doc;
            }
        });
    }

    addGroups(): void {
        this.dialogService.confirm(
            'Add Groups',
            `Are you sure you want to add additional groups to the event? All holes with only one available 
             group (i.e. all par threes) will get an additional empty group for additional sign ups.`)
            .then(() => {
                this.registrationService.addGroups(this.eventDetail.id)
                    .then((nbr: number) => {
                        if (nbr > 0) {
                            this.eventService.refreshEventDetail().then(() => {
                                this.toaster.pop('success', 'Groups Added', `${nbr} additional groups were added to the event`);
                            });
                        } else {
                            this.toaster.pop('warning', 'No Groups Added', 'No additional groups were added to the event. Are the par 3s already full?');
                        }
                    })
                    .catch(err => {
                        this.toaster.pop('error', 'No Groups Added', err);
                    });
            })
            .catch(() => { /* no-op */ });
    }
}
