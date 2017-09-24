import { Component, OnInit, ViewChild } from '@angular/core';
import { EventDetailService } from '../../../core/services/event-detail.service';
import { PaymentComponent } from '../../../shared/payments/payment.component';
import { PublicMember, MemberService } from '../../../core';
import { Observable } from 'rxjs/Observable';
import { EventRegistrationGroup } from '../../../core/models/event-registration-group';
import { EventDetail } from '../../../core/models/event-detail';
import { RegistrationService } from '../../../core/services/registration.service';

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
        Observable.forkJoin([
            this.eventService.getEventDetail(40),
            this.memberService.getMembers(),
        ]).subscribe(
            results => {
                this.eventDetail = results[0];
                this.members = results[1].filter((m: PublicMember) => {
                    if (!this.eventDetail.isRegistered(m.id)) {
                        return m;
                    }
                });
            }
        );
    }

    reserve() {
        this.registrationService.reserve(this.eventDetail.id).then( () => {
            this.group = this.registrationService.currentGroup;
            this.group.clearRegistration(this.group.registrations[0].id);
            this.group.registerMember(this.getRandomMember());
            this.group.registerMember(this.getRandomMember());
            this.group.updatePayment(this.eventDetail);
        });
    }

    cancel() {
        this.registrationService.cancelReservation(this.group).then( () => {
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
