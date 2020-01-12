import { Component, OnInit } from '@angular/core';
import { EventDocument, DocumentService, DocumentType, EventType } from '../../../core';
import { ConfigService } from '../../../app-config.service';

@Component({
    moduleId: module.id,
    templateUrl: 'league-results.component.html',
    styleUrls: ['league-results.component.css']
})
export class LeagueResultsComponent implements OnInit {

    currentYear: EventDocument[] =  [];
    archives: EventDocument[] = [];
    years: number[] = [];
    selectedYear = 0;
    thisYear = 0;

    constructor(private configService: ConfigService,
                private documentService: DocumentService) {
    }

    ngOnInit(): void {
        this.thisYear = this.configService.config.year;
        this.loadArchiveYears();
        this.documentService.getDocuments(DocumentType.Results, undefined, EventType.League)
            .subscribe(docs => {
                this.currentYear = docs.filter(d => d.year === this.thisYear);
                this.archives = docs.filter(d => d.year !== this.thisYear);
            });
    }

    loadArchiveYears(): void {
        this.selectedYear = this.thisYear - 1;
        this.years = [];
        let year = 2013;
        do {
            this.years.push(year);
            year += 1;
        } while (year < this.thisYear);
    }
}
