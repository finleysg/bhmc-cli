import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, empty } from 'rxjs';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { EventDetail, PublicMember, EventRegistration,
  RegistrationService, MemberService } from '../../../core';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-drop-player',
  templateUrl: './drop-player.component.html',
  styleUrls: ['./drop-player.component.css']
})
export class DropPlayerComponent implements OnInit, OnDestroy {

  private readonly onDestroy = new Subject<void>();

  public eventDetail: EventDetail;
  public allMembers: PublicMember[];
  public selectedMemberName: string;
  public currentMember: PublicMember;
  public registration: EventRegistration;
  public refund: boolean;

  constructor(
    private registrationService: RegistrationService,
    private memberService: MemberService,
    private toaster: ToasterService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.onDestroy))
      .subscribe((data: { eventDetail: EventDetail }) => {
        this.eventDetail = data.eventDetail;
        console.log(this.eventDetail);
        this.memberService.getMembers()
          .pipe(takeUntil(this.onDestroy))
          .subscribe(members => {
            // already registered
            this.allMembers = members.filter(m => this.eventDetail.registrations.findIndex(r => r.memberId === m.id) >= 0);
          });
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  findRegistration(member: PublicMember) {
    this.registrationService.getRegistration(this.eventDetail.id, member.id)
      .pipe(takeUntil(this.onDestroy))
      .subscribe((reg: EventRegistration) => this.registration = reg);
  }

  findMember($event: TypeaheadMatch): void {
    this.currentMember = $event.item;
    this.findRegistration($event.item);
    this.selectedMemberName = '';
  }

  savePlayer(): void {
    this.registrationService.dropRegistration(this.registration, this.refund).pipe(
      tap(() => {
        this.toaster.pop('success', 'Player Dropped', `${this.registration.memberName} has been removed from the event`);
        this.clear();
      }),
      catchError((err: string) => {
        this.toaster.pop('error', 'Drop Player Failure', err);
        return empty();
      }),
      takeUntil(this.onDestroy)
    ).subscribe();
  }

  clear(): void {
    this.currentMember = null;
    this.registration = null;
    this.refund = false;
  }
}
