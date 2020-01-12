import { Component, OnInit } from '@angular/core';
import { MemberService, PublicMember, EventDetail, EventDetailService } from '../../../core';
import { SpinnerService } from '../../../shared/spinner/spinner.service';
import { ConfigService } from '../../../app-config.service';

@Component({
    moduleId: module.id,
    templateUrl: 'account-report.component.html',
    styleUrls: ['account-report.component.css']
})
export class AccountReportComponent implements OnInit {

    public report: PublicMember[] = [];
    public signup?: EventDetail;

    constructor(
        private spinnerService: SpinnerService,
        private eventService: EventDetailService,
        private configService: ConfigService,
        private memberService: MemberService) { }

    ngOnInit(): void {
        this.spinnerService.show('accounts');
        this.memberService.getMembers().subscribe(members => {
            this.report = members;
            this.eventService.getEventDetail(this.configService.config.registrationId).subscribe(event => {
                this.signup = event;
                this.report.forEach(m => {
                    // tslint:disable-next-line: no-non-null-assertion
                    m.isRegistered = (this.signup!.registrations.findIndex(r => r.memberId === m.id) >= 0);
                });
                setTimeout(() => {
                    this.spinnerService.hide('accounts');
                }, 500);
            });
        });
    }

    exportCsv(): string {
        let csv = 'GHIN,Last Name,First Name,Email,Birth Date,Age,Is Current,Is Active,Date Joined\n';
        if (this.report) {
            this.report.forEach(m => {
                // tslint:disable-next-line:max-line-length
                csv += `${m.ghin},${m.lastName},${m.firstName},${m.email},${m.birthDateFormatted},${m.ageFormatted},${m.isRegistered ? 1 : 0},${m.isActive ? 1 : 0},${m.signupDateFormatted}` + '\n';
            });
        }
        return csv;
    }
}
