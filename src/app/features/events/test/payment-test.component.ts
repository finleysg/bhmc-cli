import { Component, OnInit, ViewChild } from '@angular/core';
import { EventDetailService } from '../../../core/services/event-detail.service';
import { PaymentComponent } from '../../../shared/payments/payment.component';
import { PublicMember, MemberService } from '../../../core';
import { EventRegistrationGroup } from '../../../core/models/event-registration-group';
import { EventDetail } from '../../../core/models/event-detail';
import { RegistrationService } from '../../../core/services/registration.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
    moduleId: module.id,
    templateUrl: 'payment-test.component.html'
})
export class PaymentTestComponent implements OnInit {

    @ViewChild(PaymentComponent) paymentComponent: PaymentComponent;

    public group: EventRegistrationGroup;
    public eventDetail: EventDetail;
    public members: PublicMember[];

    constructor(
        private eventService: EventDetailService,
        private registrationService: RegistrationService,
        private memberService: MemberService) {
    }

    ngOnInit(): void {
        this.memberService.getMembers().subscribe(members => {
            this.eventService.getEventDetail(40).subscribe(evt => {
                this.eventDetail = evt;
                this.members = members.filter((m:PublicMember) => {
                    if (!this.eventDetail.isRegistered(m.id)) {
                        return m;
                    }
                });
            });
        });
    }

    reserve() {
        this.registrationService.reserve(this.eventDetail.id).subscribe( () => {
            this.group = this.registrationService.currentGroup;
            this.group.clearRegistration(this.group.registrations[0].id);
            this.group.registerMember(this.getRandomMember());
            this.group.registerMember(this.getRandomMember());
            this.group.updatePayment(this.eventDetail);
        });
    }

    cancel() {
        this.registrationService.cancelReservation(this.group).subscribe( () => {
            this.group = new EventRegistrationGroup();
        });
    }

    pay() {
        this.paymentComponent.open();
    }

    done(result: boolean): void {
        console.log(result);
    }

    private getRandomMember(): PublicMember {
        let min = Math.ceil(100);
        let max = Math.floor(0);
        let id = Math.floor(Math.random() * (max - min)) + min;
        return this.members[id];
    }
}
