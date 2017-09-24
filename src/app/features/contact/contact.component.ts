import { Component, OnInit } from '@angular/core';
import { ContactMessage } from './contact-message';
import { ContactService } from './contact.service';
import { ToasterService } from 'angular2-toaster';

@Component({
    moduleId: module.id,
    templateUrl: 'contact.component.html',
    styleUrls: ['contact.component.css']
})
export class ContactComponent implements OnInit {

    public message: ContactMessage;
    public loading: boolean;

    constructor(private contactService: ContactService,
                private toaster: ToasterService) {
    }

    ngOnInit(): void {
        this.message = new ContactMessage();
    }

    sendMessage(form: any) {
        if (!form.valid) {
            return;
        }
        this.loading = true;
        this.contactService.sendContactUsMessage(this.message)
            .then(
                () => {
                    this.toaster.pop(
                        'success',
                        'Message Sent',
                        'Your message has been sent. Someone will get back to you at the earliest opportunity.'
                    );
                }
            )
            .catch(
                err => {
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
