import { Injectable } from '@angular/core';
import { BhmcDataService } from '../../core/services/bhmc-data.service';
import { ContactMessage } from './contact-message';
import { Contact } from './contact';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContactService {

    constructor(private dataService: BhmcDataService) {
    }

    getContactData(): Observable<Contact> {
        return this.dataService.getApiRequest('contacts').pipe(
            map(contacts => {
                return new Contact().fromJson(contacts[0]);
            })
        )
    }
    
    sendContactUsMessage(message: ContactMessage) {
        return this.dataService.postApiRequest('contact-us', message);
    }
}
