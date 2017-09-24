import { Injectable } from '@angular/core';
import { BhmcDataService } from './bhmc-data.service';
import { Observable } from 'rxjs/Observable';
import { EventDocument, DocumentType } from '../models/event-document';
import { PhotoType, Photo } from '../models/photo';
import { EventType, EventDetail } from '../models/event-detail';
import { RequestMethod } from '@angular/http';
import { ConfigService } from '../../app-config.service';

class DocumentFilter {
    constructor(docType?: DocumentType, year?: number, eventType?: EventType) {
        this.dtype = docType ? EventDocument.getDocumentCode(docType) : null;
        this.etype = eventType ? EventDetail.getEventCode(eventType) : null;
        this.year = year || null;
    }
    year: number;
    dtype: string;
    etype: string;
}

class PhotoFilter {
    constructor(picType?: PhotoType, year?: number, eventType?: EventType) {
        this.ptype = picType ? Photo.getPhotoCode(picType) : null;
        this.etype = eventType ? EventDetail.getEventCode(eventType) : null;
        this.year = year || null;
    }
    year: number;
    ptype: string;
    etype: string;
}

@Injectable()
export class DocumentService {

    constructor(private dataService: BhmcDataService,
                private configService: ConfigService) {
    }

    getDocuments(docType?: DocumentType, year?: number, eventType?: EventType): Observable<EventDocument[]> {
        let filter = new DocumentFilter(docType, year, eventType);
        return this.dataService.getApiRequest('documents', filter).map(members => {
            return members.map((m: any) => {
                return new EventDocument().fromJson(m);
            });
        });
    }


    uploadDocument(form: FormData, id: number = 0): Promise<EventDocument> {
        let method = RequestMethod.Post;
        let resource = 'documents/';
        if (id > 0) {
            method = RequestMethod.Patch;
            resource = resource + id.toString() + '/';
        }
        const url: string = this.configService.config.apiUrl + resource;
        return this.dataService.request(method, url, form)
            .map((json: any) => {
                return new EventDocument().fromJson(json);
            })
            .toPromise();
    }

    getPhotos(picType?: PhotoType, year?: number, eventType?: EventType): Observable<Photo[]> {
        let filter = new PhotoFilter(picType, year, eventType);
        return this.dataService.getApiRequest('photos', filter).map(pics => {
            return pics.map((pic: any) => {
                return new Photo().fromJson(pic);
            });
        });
    }
}
