import { ElementRef, OnInit, OnDestroy, Input, Directive } from '@angular/core';
import { SpinnerService } from './spinner.service';
import { Subscription } from 'rxjs';

declare let Spinner: any;

// tslint:disable-next-line: directive-selector
@Directive({ selector: '[bhmc-spinner]' })
export class SpinnerDirective implements OnInit, OnDestroy {

    private spinner: any;
    private element: any;
    private subscription?: Subscription;
    private spinnerName: string;

    @Input('bhmc-spinner') name?: string;
    @Input() scale = 0.5; // Scales overall size of the spinner
    @Input() color = '#008000'; // #rgb or #rrggbb or array of colors

    constructor(private spinnerElement: ElementRef,
                private spinnerService: SpinnerService) {
        this.element = spinnerElement.nativeElement;
        this.spinnerName = this.name || 'spinner';
    }

    ngOnInit() {
        this.initSpinner();
        this.createServiceSubscription();
    }

    private initSpinner() {
        const options = {
            lines: 17,
            length: 0,
            width: 10,
            radius: 25,
            scale: this.scale,
            corners: 1.0,
            color: this.color,
            opacity: 0.05,
            rotate: 0,
            direction: 1,
            speed: 0.7,
            trail: 60,
            zIndex: 2e9, // Artificially high z-index to keep on top
        };
        this.spinner = new Spinner(options);
    }

    private createServiceSubscription() {
        this.subscription = this.spinnerService.getSpinner(this.spinnerName).subscribe((show: boolean) => {
            if (show) {
                this.spinner.spin(this.element);
            } else {
                this.spinner.stop();
            }
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.spinnerService.remove(this.spinnerName);
    }
}
