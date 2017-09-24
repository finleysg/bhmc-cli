import { Component, OnInit } from '@angular/core';
import { MemberService, PublicMember } from '../../../core';
import { SpinnerService } from '../../../shared/spinner/spinner.service';

@Component({
    moduleId: module.id,
    templateUrl: 'account-report.component.html',
    styleUrls: ['account-report.component.css']
})
export class AccountReportComponent implements OnInit {

    public report: PublicMember[];

    constructor(
        private spinnerService: SpinnerService,
        private memberService: MemberService) { }

    ngOnInit(): void {
        this.spinnerService.show('accounts');
        this.memberService.getMembers().subscribe(members => {
            this.report = members
            setTimeout(() => {
                this.spinnerService.hide('accounts');
            }, 500);
        });
    }

    exportCsv(): string {
        let csv = PublicMember.getCsvHeader() + '\n';
        if (this.report) {
            this.report.forEach(m => {
                csv += m.getCsvData() + '\n';
            });
        }
        return csv;
    }
}
