import { Directive, ElementRef, HostListener } from '@angular/core';
import { CreditCardService } from './credit-card.service';

@Directive({
    selector: '[ccCVC]'
})
export class CvcFormatDirective {

    public target: any;

    constructor(
        private el: ElementRef,
        private cardService: CreditCardService
    ) {
        this.target = this.el.nativeElement;
    }

    @HostListener('keypress', ['$event']) onKeypress(e: any) {
        if (!this.cardService.restrictNumeric(e) && !this.cardService.restrictCvc(e.which, this.target)) {
            e.preventDefault();
        }
    }

    @HostListener('paste', ['$event']) onPaste(e: any) {
        this.reformatCvc(e)
    }

    // @HostListener('change', ['$event']) onChange(e: any) {
    //     this.reformatCvc(e)
    // }

    @HostListener('input', ['$event']) onInput(e: any) {
        this.reformatCvc(e)
    }

    private reformatCvc(e: any) {
        setTimeout(() => {
            let val = this.cardService.replaceFullWidthChars(this.target.value);
            val = val.replace(/\D/g, '').slice(0, 4);
            this.target.selectionStart = this.target.selectionEnd = this.cardService.safeVal(val, this.target);
        });
    }
}
