import { Injectable } from '@angular/core';

declare const swal: any;

@Injectable()
export class DialogService {
    /**
     * Ask user to confirm an action. `message` explains the action and choices.
     * Returns promise resolving to `true`=confirm or `false`=cancel
     */
    confirm(title: string, message: string) {
        return swal({
            title: title,
            text: message,
            type: 'warning',
            showCancelButton: true
        });
    };

    info(title: string, message: string) {
        return swal({
            title: title,
            text: message,
            type: 'info'
        });
    }
}
