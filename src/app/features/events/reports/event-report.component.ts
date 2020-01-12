import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { EventDetail, EventType, RegistrationService, EventData, EventDataSummary } from '../../../core';
import { SpinnerService } from '../../../shared/spinner/spinner.service';

@Component({
    moduleId: module.id,
    templateUrl: 'event-report.component.html',
    styleUrls: ['event-report.component.css']
})
export class EventReportComponent implements OnInit {

    public eventDetail: EventDetail = new EventDetail({});
    public report: EventData[] = [];
    public summary: EventDataSummary = new EventDataSummary(this.eventDetail);
    public showCourse = false;
    public showHole = false;
    public showGroup = false;

    constructor(
        private route: ActivatedRoute,
        private spinnerService: SpinnerService,
        private registerService: RegistrationService) { }

    ngOnInit(): void {
        this.spinnerService.show('event-rpt');
        this.route.data
            .subscribe(data => {
                if (data.eventDetail instanceof EventDetail) {
                    this.eventDetail = data.eventDetail;
                    this.summary = new EventDataSummary(data.eventDetail);
                    this.registerService.getGroups(this.eventDetail.id)
                        .subscribe(groups => {
                            this.report = [];
                            this.eventDetail.registrations.forEach(r => {
                                const group = groups.find(g => g.id === r.groupId);
                                if (group && r.memberId > 0) {
                                    this.report.push(EventData.create(this.eventDetail, group, r));
                                    this.summary.update(r);
                                }
                            });
                        });
                    this.showCourse = this.eventDetail.eventType === EventType.League;
                    this.showHole = this.eventDetail.eventType === EventType.League;
                    this.showGroup = this.eventDetail.eventType === EventType.Major && this.eventDetail.groupSize > 1;
                    setTimeout(() => {
                        this.spinnerService.hide('event-rpt');
                    }, 500);
                }
            });
    }

    // shaped to match the spreadsheet currently in use
    legacyCsv(): string {
        // tslint:disable-next-line: max-line-length
        let csv = `Course,Hole Group,Member ID,Team,Last Name,First Name,Member Responsible,Date Reserved,Payment Code,Req Cost,Gross Skins,Net Skins,Green Fees,Cart Fee,Player\n`;
        this.report.forEach(row => {
            // tslint:disable-next-line: max-line-length
            csv += `${this.showCourse ? row.course : ''},${this.showHole ? row.hole : ''},${row.memberGhin},${this.showGroup ? row.groupId : ''},${row.lastName},${row.firstName},${row.signedUpBy},${row.reserved},${row.paymentCode},${row.eventFee},${row.grossSkinsFee},${row.netSkinsFee},${row.greenFee},${row.cartFee},${row.memberName}\n`;
        });
        return csv;
    }

    wednesdayCsv(): string {
        let csv = EventData.getWednesdayRegistrationHeader() + '\n';
        this.report.forEach(row => {
            csv += row.getWednesdayRegistrationCsv() + '\n';
        });
        return csv;
    }

    majorCsv(): string {
        let csv = EventData.getMajorRegistrationHeader() + '\n';
        this.report.forEach(row => {
            csv += row.getMajorRegistrationCsv() + '\n';
        });
        return csv;
    }
}
