import { Calendar, CalendarService } from '../../core';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    templateUrl: 'calendar.component.html',
    styleUrls: ['calendar.component.css']
})
export class CalendarComponent implements OnInit {

    public calendar: Calendar;
    public monthListing: any[];

    constructor(
        private calendarService: CalendarService,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.calendarService.currentMonth$.subscribe(cal => this.calendar = cal);
        this.route.params.subscribe((p: Params) => {
            this.calendarService.setCalendar(+p['year'], p['month']);
            this.updateMonthListing(+p['year']);
        });
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
