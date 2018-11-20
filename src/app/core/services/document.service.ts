import { Injectable } from '@angular/core';
import { BhmcDataService } from './bhmc-data.service';
import { Observable } from 'rxjs';
import { EventDocument, DocumentType } from '../models/event-document';
import { PhotoType, Photo } from '../models/photo';
import { EventType, EventDetail } from '../models/event-detail';
import { map } from 'rxjs/operators';

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

    constructor(private dataService: BhmcDataService) {  }

    getDocuments(docType?: DocumentType, year?: number, eventType?: EventType): Observable<EventDocument[]> {
        const filter = new DocumentFilter(docType, year, eventType);
        return this.dataService.getApiRequest('documents', filter).pipe(
            map(members => {
                return members.map((m: any) => {
                    return new EventDocument().fromJson(m);
                });
            })
        );
    }

    uploadDocument(form: FormData, id: number = 0): Observable<EventDocument> {
        let resource = 'documents/';
        if (id > 0) {
            resource = resource + id.toString() + '/';
            return this.dataService.patchForm(resource, form).pipe(
                map((json: any) => {
                    return new EventDocument().fromJson(json);
                })
            );
        }
        return this.dataService.postForm(resource, form).pipe(
            map((json: any) => {
                return new EventDocument().fromJson(json);
            })
        );
    }

    getPhotos(picType?: PhotoType, year?: number, eventType?: EventType): Observable<Photo[]> {
        const filter = new PhotoFilter(picType, year, eventType);
        return this.dataService.getApiRequest('photos', filter).pipe(
            map(pics => {
                return pics.map((pic: any) => {
                    return new Photo().fromJson(pic);
                });
            })
        );
    }
}
