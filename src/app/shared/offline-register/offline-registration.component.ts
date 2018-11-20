import { Component, OnInit, Input } from '@angular/core';
import { RegistrationService, EventPayment, EventDetail, MemberService, PublicMember } from '../../core';
import { ToasterService } from 'angular2-toaster';
import { ConfigService } from '../../app-config.service';
import { AppConfig } from '../../app-config';
import { FormGroup } from '@angular/forms';
import { OfflineRegistration } from './offline-registration';
import { OfflineRegistrationForm } from './offline-registration-form.service';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { empty } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Component({
    moduleId: module.id,
    // tslint:disable-next-line:component-selector
    selector: 'offline-registration',
    templateUrl: 'offline-registration.component.html',
    styleUrls: ['offline-registration.component.css']
})
export class OfflineRegistrationComponent implements OnInit {

    @Input() eventDetail: EventDetail;

    public registration: OfflineRegistration;
    public offlineForm: FormGroup;
    public fieldErrors: any;
    public members: PublicMember[];
    public selectedMemberName: string;
    public config: AppConfig;
    public loading: boolean;
    public registered: boolean;

    constructor(
        private toaster: ToasterService,
        private registrationService: RegistrationService,
        private memberService: MemberService,
        private formService: OfflineRegistrationForm,
        private configService: ConfigService) {
    }

    ngOnInit(): void {
        this.registration = new OfflineRegistration();
        this.config = this.configService.config;
        this.formService.form$.subscribe(form => this.offlineForm = form);
        this.formService.errors$.subscribe(errors => this.fieldErrors = errors);
        this.memberService.getMembers().subscribe(members => {
            this.members = members;
        });
        this.formService.buildForm(this.registration);
    }

    addPlayer($event: TypeaheadMatch): void {
        // The value in the match here is the member name (not an object)
        const member = this.members.find(m => {
            return m.name === $event.value;
        });
        this.registration.members.push(member);
        this.selectedMemberName = '';
    }

    removePlayer(id: number): void {
        const index = this.registration.members.findIndex(m => m.id === id);
        this.registration.members.splice(index, 1);
    }

    // TODO: ensure the number of members is not greater than the event max
    register(): void {
        this.formService.updateValue(this.registration);
        this.registrationService.reserve(this.eventDetail.id).pipe(
            map(() => {
                // fill out the group and registrations
                const group = this.registrationService.currentGroup;
                group.paymentConfirmationCode = this.registration.paymentNotes;
                group.payment = new EventPayment();
                group.payment.total = this.registration.paymentAmount;
                // remove the admin (current user) from the registrations
                group.clearRegistrations();
                this.registration.members.forEach(m => group.registerMember(m));
                return this.registrationService.register(group);
            }),
            tap(() => {
                this.toaster.pop('success', 'Registration Complete', 'The player(s) have been registered in ' + this.eventDetail.name);
            }),
            catchError(err => {
                this.toaster.pop('error', 'Registration Error', err);
                return empty();
            })
        ).subscribe();
    }
}
