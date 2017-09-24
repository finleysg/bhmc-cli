import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, EventDetail, MemberService, PublicMember, EventRegistration,
    SlotPayment, RegistrationService } from '../../../core';
import { TypeaheadMatch, ModalDirective } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';

declare const moment: any;

@Component({
    moduleId: module.id,
    templateUrl: 'check-in.component.html',
    styleUrls: ['check-in.component.css']
})
export class CheckInComponent implements OnInit {

    @ViewChild('openHolesModal')
    public openHolesModal: ModalDirective;

    public eventDetail: EventDetail;
    public allMembers: PublicMember[];
    public selectedMemberName: string;
    public currentMember: PublicMember;
    public registration: EventRegistration;
    public registrationOriginal: EventRegistration;
    public selectedHole: EventRegistration;
    public openHoles: EventRegistration[] = [];
    public payment: SlotPayment;

    constructor(private authService: AuthenticationService,
                private registrationService: RegistrationService,
                private memberService: MemberService,
                private toaster: ToasterService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.data
            .subscribe((data: {eventDetail: EventDetail}) => {
                this.eventDetail = data.eventDetail;
                this.memberService.getMembers().subscribe(
                    members => {
                        this.allMembers = members;
                    }
                );
        });
    }

    findRegistration(member: PublicMember) {
        this.registrationService.getRegistration(this.eventDetail.id, member.id)
            .then((reg: EventRegistration) => {
                if (reg) {
                    this.registration = reg;
                    this.registrationOriginal = _.clone(reg);
                }
            });
    }

    findMember($event: TypeaheadMatch): void {
        this.currentMember = $event.item;
        this.findRegistration($event.item);
        this.payment = new SlotPayment();
        this.payment.paymentConfirmationCode = "Cash";
        this.payment.recordingMemberId = this.authService.user.member.id;
        this.selectedMemberName = '';
    }

    addPlayer(): void {
        this.registration = _.clone(this.selectedHole);
        this.registrationOriginal = _.clone(this.selectedHole);
        this.registration.memberId = this.currentMember.id;
        this.registration.memberFirstName = this.currentMember.firstName;
        this.registration.memberLastName = this.currentMember.lastName;
        this.registration.memberGhin = this.currentMember.ghin;
        this.registration.memberEmail = this.currentMember.email;
        this.registration.memberName = this.currentMember.name;
        this.registration.isEventFeePaid = true;
        this.updatePayment();
        this.selectedHole = null;
        this.openHolesModal.hide();
    }

    movePlayer(): void {

    }

    dropPlayer(): void {

    }

    savePlayer(): void {
        if (this.registration.groupId > 0) {
            this.registrationService.updateRegistration(this.registration)
                .then(() => {
                    return this.registrationService.addSlotPayment(this.payment);
                })
                .then(() => {
                    this.toaster.pop('success', 'Check-in Complete', `${this.registration.memberName} has been checked in`);
                    this.clear();
                })
                .catch((err: string) => {
                    this.toaster.pop('error', 'Check-in Failure', err);
                });
        } else {
            this.registrationService.sameDayRegistration(this.eventDetail, this.registration, this.payment)
                .then(() => {
                    this.toaster.pop('success', 'Check-in Complete', `${this.registration.memberName} has been checked in`);
                    this.clear();
                })
                .catch((err: string) => {
                    this.toaster.pop('error', 'Check-in Failure', err);
                });
        }
    }

    clear(): void {
        this.currentMember = null;
        this.registration = null;
        this.registrationOriginal = null;
        this.payment = null;
    }

    findOpenHole(): void {
        this.registrationService.getOpenSlots(this.eventDetail.id).subscribe(registrations => {
            this.openHoles = registrations;
            this.openHolesModal.show();
        });
    }

    selectHole(reg: EventRegistration): void {
        this.selectedHole = reg;
    }

    cancelOpenHoles(): void {
        this.selectedHole = null;
        this.openHolesModal.hide();
    }

    updatePayment(): void {
        this.payment.updatePayment(this.eventDetail, this.registration, this.registrationOriginal);
    }

    isDirty(): boolean {
        let dirty = false;
        if (this.registration) {
            dirty = (!this.registration.groupId ||
                     this.registration.isNetSkinsFeePaid !== this.registrationOriginal.isNetSkinsFeePaid ||
                     this.registration.isGrossSkinsFeePaid !== this.registrationOriginal.isGrossSkinsFeePaid ||
                    (this.registration.groupId === -1 && this.registration.memberId > 0)
            );
        }
        return dirty;
    }
}
