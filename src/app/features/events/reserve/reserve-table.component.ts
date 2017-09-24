import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { EventSignupTable } from '../models/event-signup-table';
import { AuthenticationService, User, EventDetailService, RegistrationService } from '../../../core';
import { RegistrationSlot, SlotStatus } from '../models/registration-slot';
import { RegistrationRow } from '../models/registration-row';
import { ToasterService } from 'angular2-toaster';

@Component({
    moduleId: module.id,
    templateUrl: 'reserve-table.component.html',
    styleUrls: ['reserve-table.component.css']
})
export class ReserveTableComponent implements OnInit {

    public currentUser: User;
    public table: EventSignupTable;

    constructor(private eventService: EventDetailService,
                private registrationService: RegistrationService,
                private authService: AuthenticationService,
                private toaster: ToasterService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.currentUser = this.authService.user;
        this.route.params.subscribe((p: Params) => {
            this.eventService.signupTable(+p['course']).subscribe(table => this.table = table);
        });
    }

    // TODO: better place for this?
    slotClass(slot: RegistrationSlot): string {
        let className = this.table.courseName.replace(' ', '').toLowerCase();
        if (slot.selected) {
            className = 'bg-warning clickable';
        } else if (slot.status === SlotStatus.Reserved) {
            className = 'text-success';
        } else if (slot.status === SlotStatus.Pending) {
            className = 'bgm-gray';
        }
        return className;
    };

    selectSlot = (row: RegistrationRow, slot: RegistrationSlot) => {
        if (slot.canSelect) {
            slot.selected = !slot.selected;
            // clear any selections in a different row (TODO: move to class)
            this.table.rows.forEach(r => {
                r.slots.forEach((s: RegistrationSlot) => {
                    if (s.row.name !== row.name) {
                        s.selected = false;
                    }
                });
            });
        }
    };

    selectRow = (row: RegistrationRow) => {
        row.slots.forEach(s => {
            if (s.canSelect) {
                s.selected = true;
            }
        });
        // clear any selections in a different row (TODO: move to class)
        this.table.rows.forEach(r => {
            r.slots.forEach(s => {
                if (s.row.name !== row.name) {
                    s.selected = false;
                }
            });
        });
    };

    register = (row: RegistrationRow) => {
        // The group created is saved on the service
        let eventId = this.route.snapshot.parent.parent.params['id'];
        this.registrationService.reserve(eventId, row)
            .then(() => {
                this.router.navigate(['register'], {relativeTo: this.route.parent.parent});
            })
            .catch(err => {
                this.eventService.refreshEventDetail();
                this.toaster.pop('error', 'Reservation Failure', err);
            });
    }
}
