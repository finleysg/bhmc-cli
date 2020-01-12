import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { EventDetail, RegistrationService, EventRegistrationGroup, StripeCharge } from '../../../core';
import { ConfigService } from '../../../app-config.service';
import { AppConfig } from '../../../app-config';
import { SpinnerService } from '../../../shared/spinner/spinner.service';
import { forkJoin } from 'rxjs';

@Component({
    moduleId: module.id,
    templateUrl: 'reconciliation-report.component.html',
    styleUrls: ['reconciliation-report.component.css']
})
export class ReconciliationReportComponent implements OnInit {

    public eventDetail: EventDetail = new EventDetail({});
    public report: any[] = [];
    public config: AppConfig;

    constructor(
        private route: ActivatedRoute,
        private configService: ConfigService,
        private spinnerService: SpinnerService,
        private registrationService: RegistrationService) {

        this.config = this.configService.config;
    }

    ngOnInit(): void {
        this.spinnerService.show('recon');
        this.route.data
            .subscribe(data => {
                if (data.eventDetail instanceof EventDetail) {
                    this.eventDetail = data.eventDetail;
                    forkJoin(
                        this.registrationService.getPayments(this.eventDetail.id),
                        this.registrationService.getGroups(this.eventDetail.id)
                    ).subscribe(results => {
                        this.report = [];
                        const charges: StripeCharge[] = results[0];
                        const groups: EventRegistrationGroup[] = results[1];
                        groups.forEach((group: EventRegistrationGroup) => {
                            let reconCode = 'OK';
                            let charge: any = {};
                            // tslint:disable-next-line: no-non-null-assertion
                            if (group.paymentConfirmationCode!.indexOf('ch_') === 0) {
                                charge = charges.find((c: StripeCharge) => c.id === group.paymentConfirmationCode);
                                if (charge && charge.id) {
                                    if (charge.amount.toFixed(2) !== (+group.payment.total).toFixed(2)) {
                                        reconCode = 'ERROR';
                                    }
                                } else {
                                    reconCode = 'ERROR';
                                }
                            } else {
                                reconCode = '';
                            }
                            this.report.push({
                                group: group,
                                charge: charge,
                                reconCode: reconCode,
                                // tslint:disable-next-line: no-non-null-assertion
                                isCharge: group.paymentConfirmationCode!.indexOf('ch_') === 0,
                                link: charge ? `${this.config.stripeUrl}/${charge.id}` : ''
                            });
                        });
                        setTimeout(() => {
                            this.spinnerService.hide('recon');
                        }, 500);
                    });
                }
            });
    }

    exportCsv(): string {
        let csv = 'Group #,Signed Up By,Date Reserved,Payment Code,Amount,Member,Charge Date,Card,Status,Charge Amount,Result' + '\n';
        this.report.forEach(row => {
            // tslint:disable-next-line: max-line-length
            csv += `${row.group.id},${row.group.registrant},${row.group.paymentConfirmationDateFormatted},${row.group.paymentConfirmationCode},${+row.group.payment.total},${row.charge ? row.charge.memberName : ''},${row.charge ? row.charge.createDateFormatted : ''},${row.charge ? row.charge.card : ''},${row.charge ? row.charge.status : ''},${!row.charge ? '' : row.charge.amount},${row.reconCode}` + '\n';
        });
        return csv;
    }
}
