import { Component, OnInit } from '@angular/core';
import { EventDetail, PublicMember, RegistrationService, EventRegistrationGroup, EventDetailService,
         MemberService, EventData, EventDataSummary } from '../../../core';
import { AppConfig } from '../../../app-config';
import { ConfigService } from '../../../app-config.service';
import { SpinnerService } from '../../../shared/spinner/spinner.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
    moduleId: module.id,
    templateUrl: 'member-report.component.html',
    styleUrls: ['member-report.component.css']
})
export class MemberReportComponent implements OnInit {

    public eventDetail: EventDetail;
    public report: EventData[];
    public summary: EventDataSummary;
    public config: AppConfig;

    constructor(
        private memberService: MemberService,
        private configService: ConfigService,
        private spinnerService: SpinnerService,
        private registerService: RegistrationService,
        private eventService: EventDetailService
    ) {
        this.config = configService.config;
    }

    ngOnInit(): void {
        this.spinnerService.show('members');
        this.report = [];
        this.eventService.getEventDetail(this.config.registrationId).subscribe(evt => {
            this.eventDetail = evt;
            forkJoin(
                this.memberService.getMembers(),
                this.registerService.getGroups(this.config.registrationId)
            ).subscribe(
                results => {
                    const members = results[0];
                    const groups = results[1];
                    this.summary = new EventDataSummary(this.eventDetail);
                    this.eventDetail.registrations.forEach(r => {
                        const member = members.find((m: PublicMember) => {
                            return m.id === r.memberId;
                        });
                        const group = groups.find((g: EventRegistrationGroup) => {
                            return g.id === r.groupId;
                        });
                        const row = EventData.create(this.eventDetail, group, r);
                        if (member) { // TODO: no member would be some sort of bug
                            row.birthDate = member.birthDateFormatted;
                            row.age = member.ageFormatted;
                            row.forwardTees = member.forwardTees;
                            row.isNewMember = member.signupDate.year() === this.config.year;
                            if (row.isNewMember) {
                                row.eventFee = this.eventDetail.eventFeeAlt;
                            }
                        }
                        this.report.push(row);
                        this.summary.updateByRow(row);
                    });
                    setTimeout(() => {
                        this.spinnerService.hide('members');
                    }, 500);
                }
            );
        });
    }

    exportCsv(): string {
        let csv = EventData.getMemberRegistrationHeader() + '\n';
        if (this.report) {
            this.report.forEach(m => {
                csv += m.getMemberRegistrationCsv() + '\n';
            });
        }
        return csv;
    }
}
