import { Component, OnInit } from '@angular/core';
import { EventDetail, PublicMember, RegistrationService, EventRegistrationGroup,
         MemberService, EventData, EventDataSummary } from '../../../core';
import { AppConfig } from '../../../app-config';
import { ConfigService } from '../../../app-config.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../shared/spinner/spinner.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
    moduleId: module.id,
    templateUrl: 'matchplay-report.component.html',
    styleUrls: ['matchplay-report.component.css']
})
export class MatchplayReportComponent implements OnInit {

    public eventDetail: EventDetail;
    public report: EventData[];
    public summary: EventDataSummary;
    public config: AppConfig;

    constructor(
        private route: ActivatedRoute,
        private memberService: MemberService,
        private spinnerService: SpinnerService,
        private configService: ConfigService,
        private registerService: RegistrationService
    ) {
        this.config = configService.config;
    }

    ngOnInit(): void {
        this.spinnerService.show('match-play-rpt');
        this.report = [];
        this.route.data
            .subscribe((data: {eventDetail: EventDetail}) => {
                this.eventDetail = data.eventDetail;
                this.summary = new EventDataSummary(this.eventDetail);
                forkJoin(
                    this.memberService.getMembers(),
                    this.registerService.getGroups(this.eventDetail.id)
                ).subscribe(
                    results => {
                        const members: PublicMember[] = results[0];
                        const groups: EventRegistrationGroup[] = results[1];
                        this.eventDetail.registrations.forEach(r => {
                            const member = members.find((m: PublicMember) => m.id === r.memberId);
                            if (member) { // TODO: no member would be some sort of bug
                                const group = groups.find((g: EventRegistrationGroup) => g.id === r.groupId);
                                if (group) {
                                    const row = EventData.create(this.eventDetail, group, r);
                                    row.forwardTees = member.forwardTees;
                                    row.isNewMember = member.signupDate.year() === this.config.year;
                                    row.isNetSignup = r.isNetSkinsFeePaid; // we used skins field to designate flight choice
                                    row.isGrossSignup = r.isGrossSkinsFeePaid;
                                    this.report.push(row);
                                    this.summary.updateByRow(row, true); // isMatchplay=true
                                } else {
                                    console.log(`No group found for id ${r.groupId}`);
                                }
                            } else {
                                console.log(`No member found for id ${r.memberId}`);
                            }
                        });
                        setTimeout(() => {
                            this.spinnerService.hide('match-play-rpt');
                        }, 500);
                    }
                );
            });
    }

    exportCsv(): string {
        let csv = EventData.getMatchplayHeader() + '\n';
        if (this.report) {
            this.report.forEach(m => {
                csv += m.getMatchplayCsv() + '\n';
            });
        }
        return csv;
    }
}
