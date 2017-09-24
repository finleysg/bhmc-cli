import { Component, OnInit, Input, ElementRef, EventEmitter, Output } from '@angular/core';

declare let Spinner: any;

// TODO: set initial style from parent, and maybe enable outline styles
@Component({
    moduleId: module.id,
    selector: 'spinner-button',
    templateUrl: 'spinner-button.component.html',
    styleUrls: ['spinner-button.component.css']
})
export class SpinnerButtonComponent implements OnInit {

    @Output() onClick = new EventEmitter<string>();

    @Input() buttonText: string;
    @Input() sendingText: string;
    @Input() completeText: string;
    @Input() failureText: string;
    public pending: boolean;
    public sending: boolean;
    public complete: boolean;
    public failure: boolean;
    public disabled: boolean;
    private spinner: any;

    constructor(private spinnerElement: ElementRef) {
        this.pending = true;
    }

    ngOnInit(): void {
        this.initSpinner();
    }

    enable() {
        this.disabled = false;
    }

    disable() {
        this.disabled = true;
    }

    start(disable = true) {
        this.disabled = disable;
        this.pending = false;
        this.sending = true;
        this.spinner.spin(this.spinnerElement.nativeElement.firstElementChild);
    }

    success(enable = false) {
        this.disabled = !enable;
        this.sending = false;
        this.complete = true;
        this.spinner.stop();
    }

    error(enable = true) {
        this.disabled = !enable;
        this.sending = false;
        this.failure = true;
        this.spinner.stop();
    }

    handleClick() {
        let status = 'pending';
        if (this.sending) {
            status = 'sending'; // i.e. cancel, most likely
        } else if (this.complete) {
            status = 'complete';
        } else if (this.failure) {
            status = 'failure';
        }
        this.onClick.emit(status);
    }

    private initSpinner() {
        let options = {
            lines: 17,
            length: 0,
            width: 10,
            radius: 25,
            scale: 0.25,
            corners: 1.0,
            color: '#fff',
            opacity: 0.05,
            rotate: 0,
            direction: 1,
            speed: 0.7,
            trail: 60,
            zIndex: 2e9, // Artificially high z-index to keep on top
            left: '15px'
        };
        this.spinner = new Spinner(options);
    }
}
