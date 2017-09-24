import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EventDetail, PublicMember, RegistrationService, EventRegistrationGroup,
         MemberService, EventData, EventDataSummary } from '../../../core';
import { AppConfig } from '../../../app-config';
import { ConfigService } from '../../../app-config.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../shared/spinner/spinner.service';

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
                Observable.forkJoin([
                    this.memberService.getMembers(),
                    this.registerService.getGroups(this.eventDetail.id)
                ]).do(
                    results => {
                        let members = results[0];
                        let groups = results[1];
                        this.eventDetail.registrations.forEach(r => {
                            let member = members.find((m: PublicMember) => { return m.id === r.memberId });
                            let group = groups.find((g: EventRegistrationGroup) => { return g.id === r.groupId; });
                            let row = EventData.create(this.eventDetail, group, r);
                            if (member) { // TODO: no member would be some sort of bug
                                row.forwardTees = member.forwardTees;
                                row.isNewMember = member.signupDate.year() === this.config.year;
                                row.isNetSignup = r.isNetSkinsFeePaid; // we used skins field to designate flight choice
                            }
                            this.report.push(row);
                            this.summary.updateByRow(row, true); // isMatchplay=true
                        });
                        setTimeout(() => {
                            this.spinnerService.hide('match-play-rpt');
                        }, 500);
                    }
                ).subscribe();
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
