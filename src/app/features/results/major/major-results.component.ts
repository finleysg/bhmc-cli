import { Component, OnInit } from '@angular/core';
import { EventDocument, DocumentService, DocumentType, EventType, Photo, PhotoType } from '../../../core';
import { ConfigService } from '../../../app-config.service';

@Component({
    moduleId: module.id,
    templateUrl: 'major-results.component.html',
    styleUrls: ['major-results.component.css']
})
export class MajorResultsComponent implements OnInit {

    currentYear: EventDocument[];
    archives: EventDocument[];
    clubChampion: Photo;
    seniorChampion: Photo;
    years: number[];
    selectedYear: number;
    thisYear: number;
    
    constructor(private configService: ConfigService,
                private documentService: DocumentService) {
    }

    // TODO: move date sort to a utility
    ngOnInit(): void {
        this.thisYear = this.configService.config.year;
        this.loadArchiveYears();
        this.documentService.getDocuments(DocumentType.Results, null, EventType.Major)
            .subscribe(docs => {
                this.currentYear = docs.filter(d => d.year === this.thisYear);
                this.archives = docs.filter(d => d.year !== this.thisYear);
            });
        this.documentService.getPhotos(PhotoType.ClubChampion)
            .subscribe(pics => {
                const f = pics.sort(function(a, b) {
                    if (a.lastUpdate.isBefore(b.lastUpdate)) {
                        return 1;
                    }
                    if (a.lastUpdate.isAfter(b.lastUpdate)) {
                        return -1;
                    }
                    return 0;
                });
                if (f && f.length > 0) this.clubChampion = f[0];
            });
        this.documentService.getPhotos(PhotoType.SeniorChampion)
            .subscribe(pics => {
                const f = pics.sort(function(a, b) {
                    if (a.lastUpdate.isBefore(b.lastUpdate)) {
                        return 1;
                    }
                    if (a.lastUpdate.isAfter(b.lastUpdate)) {
                        return -1;
                    }
                    return 0;
                });
                if (f && f.length > 0) this.seniorChampion = f[0];
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
