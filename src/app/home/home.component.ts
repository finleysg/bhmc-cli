import { Component, OnInit } from '@angular/core';
import { CalendarService, CalendarEvent, AnnouncementService, Announcement,
         User, AuthenticationService, Sponsor, SponsorService } from '../core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs/observable/forkJoin';
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
        this.announcementService.currentAnnouncements().subscribe(a => this.announcements = a);
        this.calendarService.quickEvents().subscribe(e => this.eventList = e);
        this.sponsorService.getSponsors().subscribe(s => this.sponsors = s);
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
