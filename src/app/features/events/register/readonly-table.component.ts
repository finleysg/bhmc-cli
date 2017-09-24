import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { EventSignupTable } from '../models/event-signup-table';
import { AuthenticationService, User, EventDetailService } from '../../../core';
import { RegistrationSlot, SlotStatus } from '../models/registration-slot';

@Component({
    moduleId: module.id,
    templateUrl: 'readonly-table.component.html',
    styleUrls: ['readonly-table.component.css']
})
export class ReadonlyTableComponent implements OnInit {

    public currentUser: User;
    public table: EventSignupTable;

    constructor(private eventService: EventDetailService,
                private authService: AuthenticationService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.currentUser = this.authService.user;
        this.route.params.subscribe((p: Params) => {
            this.eventService.signupTable(+p['course']).subscribe(table => this.table = table);
        });
    }

    slotClass(slot: RegistrationSlot): string {
        let className = this.table.courseName.replace(' ', '').toLowerCase();
        if (slot.selected) {
            className = 'bg-warning';
        } else if (slot.status === SlotStatus.Reserved) {
            className = 'text-success';
        } else if (slot.status === SlotStatus.Pending) {
            className = 'bg-danger';
        }
        return className;
    };
}
