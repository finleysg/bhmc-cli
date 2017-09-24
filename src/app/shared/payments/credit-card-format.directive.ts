import { Directive, ElementRef, HostListener } from '@angular/core';
import { CreditCardService } from './credit-card.service';

@Directive({
    selector: '[ccNumber]'
})
export class CreditCardFormatDirective {

    public target: any;

    constructor(
        private el: ElementRef,
        private cardService: CreditCardService
    ) {
        this.target = this.el.nativeElement;
    }

    @HostListener('keypress', ['$event']) onKeypress(e: any) {
        if (e.which === 8) {
            this.handleBackspace(e);
        } else {
            if (this.cardService.restrictNumeric(e)) {
                if (this.cardService.isCardNumber(e.which, this.target)) {
                    this.handleKey(e);
                }
            } else {
                e.preventDefault();
                return false;
            }
        }
    }

    @HostListener('paste', ['$event']) onPaste(e: any) {
        this.reformatCardNumber();
    }

    // @HostListener('change', ['$event']) onChange(e: any) {
    //     this.reformatCardNumber();
    // }

    @HostListener('input', ['$event']) onInput(e: any) {
        this.reformatCardNumber();
    }

    private handleKey(e: any) {
        let card: any,
            digit: string,
            length: number,
            re: RegExp,
            upperLength: number,
            value: string;

        digit = String.fromCharCode(e.which);
        if (!/^\d+$/.test(digit)) {
            return;
        }

        value = this.target.value;
        card = this.cardService.cardFromNumber(value + digit);
        length = (value.replace(/\D/g, '') + digit).length;

        upperLength = card ? card.length[card.length.length - 1] : 16;
        if (length >= upperLength) {
            return;
        }

        if (card && card.type === 'amex') {
            re = /^(\d{4}|\d{4}\s\d{6})$/;
        } else {
            re = /(?:^|\s)(\d{4})$/;
        }

        if (re.test(value)) {
            e.preventDefault();
            setTimeout(() => {
                this.target.value = `${value} ${digit}`;
            });
        } else if (re.test(value + digit)) {
            e.preventDefault();
            setTimeout(() => {
                this.target.value = `${value}${digit} `;
            });
        }
    }

    private handleBackspace(e: any) {
        let value = this.target.value;
        if (/\d\s$/.test(value)) {
            e.preventDefault();
            setTimeout(() => {
                this.target.value = value.replace(/\d\s$/, '');
            });
        } else if (/\s\d?$/.test(value)) {
            e.preventDefault();
            setTimeout(() => {
                this.target.value = value.replace(/\d$/, '');
            });
        }
    }

    private reformatCardNumber() {
        setTimeout(() => {
            let val = this.cardService.replaceFullWidthChars(this.target.value);
            val = this.cardService.formatCardNumber(val);
            this.target.selectionStart = this.target.selectionEnd = this.cardService.safeVal(val, this.target);
        });
    }
}
