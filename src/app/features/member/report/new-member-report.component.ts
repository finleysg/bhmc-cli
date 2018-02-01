import { Component, OnInit } from '@angular/core';
import { PublicMember, MemberService, EventDetailService, EventRegistration, RegistrationService } from '../../../core';
import { AppConfig } from '../../../app-config';
import { ConfigService } from '../../../app-config.service';

@Component({
    templateUrl: 'new-member-report.component.html',
    styleUrls: ['new-member-report.component.css']
})
export class NewMemberReportComponent implements OnInit {

    public report: PublicMember[];
    public config: AppConfig;
    public currentYear: number;

    constructor(
        private memberService: MemberService,
        private configService: ConfigService,
        private eventService: EventDetailService,
        private regService: RegistrationService
    ) {
        this.config = configService.config;
    }

    ngOnInit(): void {
        this.currentYear = this.config.year;
        this.report = [];
        this.eventService.getEventDetail(this.config.registrationId).subscribe(event => {
            this.memberService.getMembers().subscribe(members => {
                this.report = members.filter(m => m.signupDate.year() === this.currentYear);
                this.regService.getGroups(event.id).subscribe(groups => {
                    this.report.forEach(r => {
                        const reg: EventRegistration = event.registrations.find(x => x.memberId === r.id);
                        if (reg) {
                            // the web service stuffs some strings into the new member reg notes
                            r.formerClub = groups.find(g => g.id === reg.groupId).notes
                                .replace('NEW MEMBER REGISTRATION', '')
                                .replace('PLAYING FORWARD TEES', '')
                                .replace('Former club:', '')
                                .trim();
                        }
                    });
                });
            });
        });
    }

    exportCsv(): string {
        let csv = 'Last Name,First Name,Email,Birth Date,Phone Number,Address,City,State,Zip,GHIN,Former Club' + '\n';
        if (this.report) {
            this.report.forEach(m => {
                // tslint:disable-next-line:max-line-length
                csv += `${m.lastName},${m.firstName},${m.email},${m.birthDateFormatted},${m.phoneNumber},${m.address},${m.city},${m.state},${m.zipCode},${m.ghin},${m.formerClub}` + '\n';
            });
        }
        return csv;
    }
}