import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import moment from 'moment';
import { ToasterService } from 'angular2-toaster';

@Component({
    moduleId: module.id,
    // tslint:disable-next-line: component-selector
    selector: 'timer',
    templateUrl: 'timer.component.html',
    styleUrls: ['timer.component.css']
})
export class TimerComponent implements OnInit {

    @Output() onTimeElapsed = new EventEmitter<string>();

    @Input() expiration: any;
    @Input() expiryMessage?: string;
    public timeRemaining = '';
    public done = false;
    private cancel = false;

    constructor(private toaster: ToasterService) { }

    ngOnInit(): void {
        setInterval( () => {
            this.update();
        }, 1000);
    }

    update() {
        // TODO: stop timer turn red at 0:00
        if (!this.cancel && !this.done) {
            const remaining = this.expiration.diff(moment(), 'seconds');
            if (remaining === 0) {
                this.toaster.pop('warning', 'Time Expired', this.expiryMessage);
                this.onTimeElapsed.emit('cancel');
                this.done = true;
            }
            // tslint:disable-next-line: no-bitwise
            const minutes = remaining / 60 | 0;
            // tslint:disable-next-line: no-bitwise
            const seconds = remaining % 60 | 0;
            this.timeRemaining = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }
    }

    start() {
        this.cancel = false;
    }

    stop() {
        this.cancel = true;
    }
}
