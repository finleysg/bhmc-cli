import { Injectable } from '@angular/core';
import { BhmcDataService } from '../../core/services/bhmc-data.service';
import { ContactMessage } from './contact-message';

@Injectable()
export class ContactService {

    constructor(private dataService: BhmcDataService) {
    }

    sendContactUsMessage(message: ContactMessage) {
        return this.dataService.postApiRequest('contact-us', message).toPromise();
    }
}
