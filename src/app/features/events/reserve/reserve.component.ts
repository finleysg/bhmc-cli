import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventDetailService, EventDetail } from '../../../core';

@Component({
    moduleId: module.id,
    // tslint:disable-next-line: component-selector
    selector: 'bhmc-reserve',
    templateUrl: 'reserve.component.html',
    styleUrls: ['reserve.component.css']
})
export class ReserveComponent implements OnInit {

    eventDetail: EventDetail = new EventDetail({});
    courses: any[] = [];

    constructor(private eventService: EventDetailService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.data
            .subscribe(data => {
                if (data.eventDetail instanceof EventDetail) {
                    this.eventDetail = data.eventDetail;
                    this.courses = this.eventService.eventCourses(this.eventDetail);
                    if (!this.route.firstChild) {
                        this.router.navigate([this.courses[0].id], {relativeTo: this.route, replaceUrl: true});
                    }
                }
            });
    }

    refresh(): void {
        this.eventService.refreshEventDetail().subscribe();
    }
}
