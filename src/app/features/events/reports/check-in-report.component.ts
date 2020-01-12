import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventSignupTable } from '../models/event-signup-table';
import { EventDetailService, EventDetail } from '../../../core';
import { SpinnerService } from '../../../shared/spinner/spinner.service';

@Component({
    moduleId: module.id,
    templateUrl: 'check-in-report.component.html',
    styleUrls: ['check-in-report.component.css']
})
export class CheckInReportComponent implements OnInit {

    public tables: EventSignupTable[] = [];
    public eventDetail: EventDetail = new EventDetail({});

    constructor(private eventService: EventDetailService,
                private spinnerService: SpinnerService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.spinnerService.show('check-in');
        this.route.data
            .subscribe(data => {
                if (data.eventDetail instanceof EventDetail) {
                this.tables = [];
                    this.eventDetail = data.eventDetail;
                    const courses = this.eventService.eventCourses(this.eventDetail);
                    courses.forEach(course => {
                        const source = this.eventService.signupTable(course.id);
                        if (source) {
                            source.subscribe(table => this.tables.push(table));
                        }
                    });
                    setTimeout(() => {
                        this.spinnerService.hide('check-in');
                    }, 500);
                }
        });
    }
}
