import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../app-config.service';
import { AppConfig } from '../../app-config';
import { CalendarService, CalendarEvent } from '../../core';

@Component({
    moduleId: module.id,
    templateUrl: 'report-landing.component.html',
    styleUrls: ['report-landing.component.css']
})
export class ReportLandingComponent implements OnInit {

    config: AppConfig;
    events: CalendarEvent[] = [];
    selectedEvent?: CalendarEvent;

    constructor(
        private calendarService: CalendarService,
        private configService: ConfigService
    ) {
        this.config = this.configService.config;
    }

    ngOnInit(): void {
        this.calendarService.quickEvents().subscribe(events => this.events = events);
    }

    selectEvent(e: CalendarEvent): void {
        this.selectedEvent = e;
    }
}
