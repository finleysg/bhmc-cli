import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
declare const moment: any;
import { ToasterService } from 'angular2-toaster';

@Component({
    moduleId: module.id,
    selector: 'timer',
    templateUrl: 'timer.component.html',
    styleUrls: ['timer.component.css']
})
export class TimerComponent implements OnInit {

    @Output() onTimeElapsed = new EventEmitter<string>();

    @Input() expiration: any;
    @Input() expiryMessage: string;
    public timeRemaining: string;
    public done: boolean;
    private cancel: boolean;

    constructor(private toaster: ToasterService) { }

    ngOnInit(): void {
        setInterval( () => {
            this.update()
        }, 1000);
    }

    update() {
        // TODO: stop timer turn red at 0:00
        if (!this.cancel && !this.done) {
            let remaining = this.expiration.diff(moment(), 'seconds');
            if (remaining === 0) {
                this.toaster.pop('warning', 'Time Expired', this.expiryMessage);
                this.onTimeElapsed.emit('cancel');
                this.done = true;
            }
            let minutes = remaining / 60 | 0;
            let seconds = remaining % 60 | 0;
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
