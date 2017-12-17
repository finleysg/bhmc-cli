import { Component, OnInit } from '@angular/core';
import { ContactMessage } from './contact-message';
import { ContactService } from './contact.service';
import { ToasterService } from 'angular2-toaster';
import { Contact } from './contact';
import { AppConfig } from '../../app-config';
import { ConfigService } from '../../app-config.service';

@Component({
    moduleId: module.id,
    templateUrl: 'contact.component.html',
    styleUrls: ['contact.component.css']
})
export class ContactComponent implements OnInit {

    config: AppConfig;
    contact: Contact;
    message: ContactMessage;
    loading: boolean;

    constructor(private contactService: ContactService,
                private toaster: ToasterService,
                private configService: ConfigService) {
    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.message = new ContactMessage();
        this.contactService.getContactData().subscribe(c => this.contact = c);
    }

    sendMessage(form: any) {
        if (!form.valid) {
            return;
        }
        this.loading = true;
        this.contactService.sendContactUsMessage(this.message).subscribe(
            () => {
                this.loading = false;
                this.toaster.pop(
                    'success',
                    'Message Sent',
                    'Your message has been sent. Someone will get back to you at the earliest opportunity.'
                );
            },
            (err) => {
                this.loading = false;
                this.toaster.pop(
                    'error',
                    'Message Error',
                    err.toString()
                );
            }
        );
    }
}
