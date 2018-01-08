import { Calendar, CalendarService, CalendarEvent, EventType,
    User, AuthenticationService } from '../../core';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../../app-config.service';
import { AppConfig } from '../../app-config';

@Component({
    moduleId: module.id,
    templateUrl: 'calendar.component.html',
    styleUrls: ['calendar.component.css']
})
export class CalendarComponent implements OnInit {

    public calendar: Calendar;
    public monthListing: any[];
    public config: AppConfig;
    public user: User;

    constructor(
        private calendarService: CalendarService,
        private router: Router,
        private configService: ConfigService,
        private authService: AuthenticationService,
        private route: ActivatedRoute
    ) {
        this.config = configService.config;
        this.user = this.authService.user;
    }

    ngOnInit(): void {
        this.calendarService.currentMonth$.subscribe(cal => this.calendar = cal);
        this.route.params.subscribe((p: Params) => {
            this.calendarService.setCalendar(+p['year'], p['month']);
            this.updateMonthListing(+p['year']);
        });
    }

    openEvent(evt: CalendarEvent): void {
        if (evt.eventType === EventType.Registration) {
            if (this.user.isAuthenticated) {
                this.router.navigate(['/events', this.config.registrationId, 'season-signup']);
            } else {
                this.router.navigate(['/member', 'new-member-signup', this.config.registrationId]);
            }
        } else {
            this.router.navigate(['/events', evt.id, 'detail']);
        }
    }

    updateMonthListing(year: number): void {
        this.monthListing = [];
        for (let i = 0; i < 12; i++) {
            this.monthListing.push({
                year: year,
                month: Calendar.getMonthName(i)
            });
        }
    }
}
