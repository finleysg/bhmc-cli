import { Directive, ElementRef, HostListener } from '@angular/core';
import { LayoutService } from '../../core/services/layout.service';

@Directive({selector: '[change-layout]'})
export class ChangeLayoutDirective {

    constructor(private el: ElementRef,
                private layoutService: LayoutService) {
        if (this.layoutService.layoutType === 1) {
            this.el.nativeElement.checked = true;
        }
    }

    @HostListener('change') onChange() {
        if (this.el.nativeElement.checked) {
            this.layoutService.updateLayout(1);
        } else {
            this.layoutService.updateLayout(0);
        }
    }
}
