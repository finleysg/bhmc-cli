import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { User, AuthenticationService, PublicMember, MemberService,
         EventDetail, EventType, EventRegistration, SkinsType,
         CanComponentDeactivate, DialogService, EventDetailService,
         EventRegistrationGroup, RegistrationService } from '../../../core';
import { ActivatedRoute, Router, CanDeactivate } from '@angular/router';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { PaymentComponent, ProcessingStatus } from '../../../shared/payments/payment.component';
import { TimerComponent } from '../../../shared/timer/timer.component';
import { tap, catchError } from 'rxjs/operators';
import { forkJoin, empty } from 'rxjs';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css']
})
export class RegisterComponent implements OnInit, CanDeactivate<CanComponentDeactivate> {

    @ViewChild(PaymentComponent) paymentComponent: PaymentComponent;
    @ViewChild(TimerComponent) timerComponent: TimerComponent;

    public registrationGroup: EventRegistrationGroup;
    public eventDetail: EventDetail;
    public currentUser: User;
    public members: PublicMember[];
    public friends: PublicMember[];
    public selectedMemberName: string;
    public expires: any;
    public expiryMessage = 'Your reservation was cancelled because it was not completed within 10 minutes.';
    public isLeagueEvent: boolean;
    public placeholder: string;
    // public hasSkins: boolean;
    private cancelling: boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private dialogService: DialogService,
        private eventService: EventDetailService,
        private registrationService: RegistrationService,
        private memberService: MemberService,
        private authService: AuthenticationService) { }

    ngOnInit(): void {
        this.currentUser = this.authService.user;
        this.route.data
            .subscribe((data: { eventDetail: EventDetail }) => {
                this.eventDetail = data.eventDetail;
                this.isLeagueEvent = this.eventDetail.eventType === EventType.League;
                // this.hasSkins = this.eventDetail.skinsType !== SkinsType.None;
                this.registrationGroup = this.registrationService.currentGroup;
                this.expires = this.registrationGroup.expires;
                this.registrationGroup.updatePayment(this.eventDetail);
                this.registrationGroup.registrations.forEach(reg => {
                    if (this.eventDetail.skinsType === SkinsType.None) {
                        reg.disableSkins = true;
                    } else if (this.eventDetail.skinsType === SkinsType.Team) {
                        reg.disableSkins = (reg.slotNumber > 0);
                    }
                });
                if (this.eventDetail.eventType === EventType.Major) {
                  this.placeholder = 'Add a note here to opt in to the championship flight.';
                }
            });
        forkJoin([
            this.memberService.getRegisteredMembers(),
            this.memberService.friends(),
        ]).subscribe(
            results => {
                this.members = results[0].filter((m: PublicMember) => {
                    if (!this.eventDetail.isRegistered(m.id)) {
                        return m;
                    }
                });
                this.friends = results[1];
                this.friends.forEach(f => {
                    f.isRegistered = this.eventDetail.isRegistered(f.id);
                });
            }
        );
    }

    add(member: PublicMember): void {
        this.registrationGroup.registerMember(member);
        this.registrationGroup.updatePayment(this.eventDetail);
        if (!member.isFriend) {
            this.memberService.addFriend(member);
        }
    }

    removeFriend(reg: EventRegistration): void {
        this.friends.forEach( f => {
            if (f.id === reg.memberId) {
                f.isRegistered = false;
            }
        });
        this.registrationGroup.clearRegistration(reg.id);
        this.registrationGroup.updatePayment(this.eventDetail);
    }

    updatePayment() {
        this.registrationGroup.updatePayment(this.eventDetail);
    }

    selectMember($event: TypeaheadMatch) {
        // The value in the match here is the member name (not an object)
        const member = this.members.find(m => {
            return m.name === $event.value;
        });
        this.add(member);
        this.selectedMemberName = '';
    }

    openPayment(): void {
        this.paymentComponent.open();
    }

    paymentComplete(result: boolean): void {
        if (result) {
            this.timerComponent.stop();
            this.eventService.refreshEventDetail().subscribe(() => {
                if (this.eventDetail.eventType === EventType.Registration) {
                    this.authService.refreshUser();
                }
                const courseId = this.registrationGroup.courseSetupId ? this.registrationGroup.courseSetupId : 0;
                this.router.navigate(['registered', courseId], { relativeTo: this.route.parent });
            });
        }
    }

    cancelReservation(): void {
        // Guard against cancelling a paid registration
        if (this.paymentComponent.processStatus !== ProcessingStatus.Complete) {
            this.cancelling = true;
            this.timerComponent.stop();
            this.registrationService.cancelReservation(this.registrationGroup).pipe(
                tap(() => {
                    this.eventService.refreshEventDetail().subscribe(() => {
                        this.location.back();
                    });
                }),
                catchError((err: string) => {
                    this.cancelling = false;
                    return empty();
                })
            ).subscribe();
        }
    }

    canDeactivate(): Promise<boolean> | boolean {
        if (this.cancelling || this.paymentComponent.processStatus === ProcessingStatus.Complete) {
            this.cancelling = false;
            return true;
        }
        return this.dialogService.confirm(
            'Cancel Registration',
            `Are you sure you want to leave the registration page? You will not be registered,
             and your hole reservation (Wednesday events) will be canceled.`)
            .then(() => {
                return this.registrationService.cancelReservation(this.registrationGroup).subscribe(() => true);
            })
            .catch(() => false);
    }

    // Warn the user about leaving. We can't change the warning text or act if the user chooses to leave.
    @HostListener('window:beforeunload')
    onBeforeUnload(): boolean {
        return (this.cancelling || this.paymentComponent.processStatus === ProcessingStatus.Complete);
    }
}
