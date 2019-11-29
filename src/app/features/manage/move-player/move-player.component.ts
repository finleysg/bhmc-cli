import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDirective, TypeaheadMatch } from 'ngx-bootstrap';
import {
  EventDetail, PublicMember, EventRegistration, RegistrationService, MemberService
} from '../../../core';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute } from '@angular/router';
import { tap, catchError, takeUntil } from 'rxjs/operators';
import { empty, Subject } from 'rxjs';

@Component({
  selector: 'app-move-player',
  templateUrl: './move-player.component.html',
  styleUrls: ['./move-player.component.css']
})
export class MovePlayerComponent implements OnInit, OnDestroy {

  private readonly onDestroy = new Subject<void>();

  @ViewChild('openHolesModal', { static: true })
  public openHolesModal: ModalDirective;

  public eventDetail: EventDetail;
  public allMembers: PublicMember[];
  public selectedMemberName: string;
  public currentMember: PublicMember;
  public registration: EventRegistration;
  public selectedHole: EventRegistration;
  public openHoles: EventRegistration[] = [];

  constructor(
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
            // already registered
            this.allMembers = members
              .filter(m => this.eventDetail.registrations.findIndex(r => r.memberId === m.id) >= 0);
          });
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  findRegistration(member: PublicMember) {
    this.registrationService.getRegistration(this.eventDetail.id, member.id)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((reg: EventRegistration) => {
        if (reg) {
          this.registration = reg;
        }
      });
  }

  findMember($event: TypeaheadMatch): void {
    this.currentMember = $event.item;
    this.findRegistration($event.item);
    this.selectedMemberName = '';
  }

  selectDestination(): void {
    this.openHolesModal.hide();
  }

  savePlayer(): void {
    this.registrationService.moveRegistration(this.registration, this.selectedHole).pipe(
      tap(() => {
        this.toaster.pop('success', 'Player Moved', `${this.registration.memberName} has been moved to ${this.selectedHole.fullName}`);
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
}
