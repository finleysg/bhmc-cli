import { Directive, ElementRef, HostListener } from '@angular/core';
import { CreditCardService } from './credit-card.service';

@Directive({
    selector: '[ccExp]'
})
export class ExpiryFormatDirective {

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
                if (this.cardService.restrictExpiry(e.which, this.target)) {
                    this.formatExpiry(e);
                    this.formatForwardSlashAndSpace(e);
                    this.formatForwardExpiry(e);
                }
            } else {
                e.preventDefault();
                return false;
            }
        }
    }

    // @HostListener('change', ['$event']) onChange(e: any) {
    //     this.reformatExpiry(e);
    // }

    @HostListener('input', ['$event']) onInput(e: any) {
        this.reformatExpiry(e);
    }

    private formatExpiry(e: any) {
        let digit = String.fromCharCode(e.which),
            val = `${this.target.value}${digit}`;

        if (!/^\d+$/.test(digit)) {
            if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
                e.preventDefault();
                setTimeout(() => {
                    this.target.value = `0${val} / `;
                });
            } else if (/^\d\d$/.test(val)) {
                e.preventDefault();
                setTimeout(() => {
                    let m1 = parseInt(val[0], 10),
                        m2 = parseInt(val[1], 10);
                    if (m2 > 2 && m1 !== 0) {
                        this.target.value = `0${m1} / ${m2}`;
                    } else {
                        this.target.value = `${val} / `;
                    }
                });
            }
        }
    }

    private formatForwardSlashAndSpace(e: any) {
        let which = String.fromCharCode(e.which),
            val = this.target.value;

        if (!(which === '/' || which === ' ')) {
            return false;
        }
        if (/^\d$/.test(val) && val !== '0') {
            this.target.value = `0${val} / `;
        }
    }

    private formatForwardExpiry(e: any) {
        let digit = String.fromCharCode(e.which),
            val = this.target.value;

        if (!/^\d+$/.test(digit) && /^\d\d$/.test(val)) {
            this.target.value = `${val} / `;
        }
    }

    private handleBackspace(e: any) {
        let val = this.target.valueOf;
        if ((this.target.selectionStart != null) && this.target.selectionStart !== val.length) {
            return;
        }
        if (/\d\s\/\s$/.test(val)) {
            e.preventDefault();
            setTimeout(function () {
                this.target.value = val.replace(/\d\s\/\s$/, '');
            });
        }
    }

    private reformatExpiry(e: any) {
        setTimeout(() => {
            let val = this.target.value;
            val = this.cardService.replaceFullWidthChars(val);
            val = this.cardService.formatExpiry(val);
            this.target.selectionStart = this.target.selectionEnd = this.cardService.safeVal(val, this.target);
        });
    }
}
