import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDirective, TypeaheadMatch } from 'ngx-bootstrap';
import {
  EventDetail, PublicMember, EventRegistration, SlotPayment, AuthenticationService,
  RegistrationService, MemberService
} from '../../../core';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute } from '@angular/router';
import { tap, catchError, takeUntil } from 'rxjs/operators';
import { empty, Subject } from 'rxjs';
import { clone } from 'lodash';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.css']
})
export class AddPlayerComponent implements OnInit, OnDestroy {

  private readonly onDestroy = new Subject<void>();

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
    this.route.data   // .pipe(takeUntil(this.onDestroy))
      .subscribe((data: { eventDetail: EventDetail }) => {
        this.eventDetail = data.eventDetail;
        console.log(this.eventDetail);
        this.memberService.getMembers()
          .pipe(takeUntil(this.onDestroy))
          .subscribe(members => {
            // not already registered
            this.allMembers = members
              .filter(m => this.eventDetail.registrations.findIndex(r => r.memberId === m.id) < 0);
          });
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  findMember($event: TypeaheadMatch): void {
    this.currentMember = $event.item;
    this.payment = new SlotPayment();
    this.payment.paymentConfirmationCode = 'Cash';
    this.payment.recordingMemberId = this.authService.user.member.id;
    this.selectedMemberName = '';
  }

  addPlayer(): void {
    this.registration = clone(this.selectedHole);
    this.registrationOriginal = clone(this.selectedHole);
    this.registration.memberId = this.currentMember.id;
    this.registration.memberFirstName = this.currentMember.firstName;
    this.registration.memberLastName = this.currentMember.lastName;
    this.registration.memberGhin = this.currentMember.ghin;
    this.registration.memberEmail = this.currentMember.email;
    this.registration.memberName = this.currentMember.name;
    this.registration.isEventFeePaid = true;
    this.updatePayment();
    this.openHolesModal.hide();
  }

  savePlayer(): void {
    this.registrationService.adminRegistration(this.eventDetail, this.registration, this.payment).pipe(
      tap(() => {
        this.toaster.pop('success', 'Player Added', `${this.registration.memberName} has been added to the event`);
        this.clear();
      }),
      catchError((err: string) => {
        this.toaster.pop('error', 'Add Player Failure', err);
        return empty();
      }),
      takeUntil(this.onDestroy)
    ).subscribe();
  }

  clear(): void {
    this.currentMember = null;
    this.registration = null;
    this.registrationOriginal = null;
    this.payment = null;
    this.selectedHole = null;
  }

  findOpenHole(): void {
    this.registrationService.getOpenSlots(this.eventDetail.id)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(registrations => {
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
}
