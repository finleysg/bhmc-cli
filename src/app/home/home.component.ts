import { Component, OnInit } from '@angular/core';
import { CalendarService, CalendarEvent, AnnouncementService, Announcement, EventDetail, EventDetailService,
         User, AuthenticationService, Sponsor, SponsorService } from '../core';
import { Router } from '@angular/router';
import { ConfigService } from '../app-config.service';
import { AppConfig } from '../app-config';
import {RegistrationWindowType} from '../core/models/event-detail';

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
    public seasonEvent: EventDetail;
    public sponsors: Sponsor[];

    constructor(
        private authService: AuthenticationService,
        private calendarService: CalendarService,
        private announcementService: AnnouncementService,
        private router: Router,
        private sponsorService: SponsorService,
        private eventService: EventDetailService,
        private configService: ConfigService) {
    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.eventService.getEventDetail(this.config.registrationId).subscribe(event => {
            this.seasonEvent = event;
        });
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

    get returningMemberRegistration(): boolean {
        return this.seasonEvent &&
            this.seasonEvent.registrationWindow === RegistrationWindowType.Registering &&
            this.user &&
            this.user.isAuthenticated &&
            !this.user.member.membershipIsCurrent;
    }

    get newMemberRegistration(): boolean {
        return this.seasonEvent &&
            this.seasonEvent.registrationWindow === RegistrationWindowType.Registering &&
            this.config.acceptNewMembers &&
            this.user &&
            !this.user.isAuthenticated;
    }
}
