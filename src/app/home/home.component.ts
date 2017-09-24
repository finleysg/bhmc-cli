import { Component, OnInit } from '@angular/core';
import { CalendarService, CalendarEvent, AnnouncementService, Announcement,
         User, AuthenticationService, Sponsor, SponsorService } from '../core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../app-config.service';
import { AppConfig } from '../app-config';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {

    public config: AppConfig;
    public announcements: Announcement[];
    public eventList: CalendarEvent[];
    public user: User;
    public sponsors: Sponsor[];

    constructor(
        private authService: AuthenticationService,
        private calendarService: CalendarService,
        private announcementService: AnnouncementService,
        private router: Router,
        private sponsorService: SponsorService,
        private configService: ConfigService) {
    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.authService.currentUser$.subscribe(user => this.user = user);
        Observable.forkJoin([
            this.announcementService.currentAnnouncements(),
            this.calendarService.quickEvents()
        ]).subscribe(
            results => {
                this.announcements = results[0];
                this.eventList = results[1];
                // this.announcements.forEach(a => {
                //     if (a.documentName) {
                //         a.documentUrl = `${this.config.apiUrl}${a.documentUrl}`
                //     }
                // });
            }
        );
        this.sponsorService.getSponsors().then(sponsors => this.sponsors = sponsors);
    }

    registerOnline(): void {
        if (this.user.isAuthenticated) {
            this.router.navigate(['/events', this.config.registrationId, 'season-signup']);
        } else {
            this.router.navigate(['/member', 'new-member-signup', this.config.registrationId]);
        }
    }

    getPassword(): void {
        this.authService.returningMember = true;
        this.router.navigate(['/member', 'reset-password']);
    }
}
