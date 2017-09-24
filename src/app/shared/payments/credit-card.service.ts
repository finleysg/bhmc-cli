import { Injectable } from '@angular/core';

@Injectable()
export class CreditCardService {

    private defaultFormat = /(\d{1,4})/g;
    private cards = [
        {
            type: 'visa',
            patterns: [4],
            format: this.defaultFormat,
            length: [13, 16],
            cvvLength: [3],
            luhn: true
        }, {
            type: 'mastercard',
            patterns: [51, 52, 53, 54, 55, 22, 23, 24, 25, 26, 27],
            format: this.defaultFormat,
            length: [16],
            cvvLength: [3],
            luhn: true
        }, {
            type: 'amex',
            patterns: [34, 37],
            format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
            length: [15],
            cvvLength: [3, 4],
            luhn: true
        }, {
            type: 'dinersclub',
            patterns: [30, 36, 38, 39],
            format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
            length: [14],
            cvvLength: [3],
            luhn: true
        }, {
            type: 'discover',
            patterns: [60, 64, 65, 622],
            format: this.defaultFormat,
            length: [16],
            cvvLength: [3],
            luhn: true
        }, {
            type: 'jcb',
            patterns: [35],
            format: this.defaultFormat,
            length: [16],
            cvvLength: [3],
            luhn: true
        }
    ];

    cardFromNumber(cardNumber: string): any {
        let card: any,
            p: string,
            pattern: number,
            ref: number[];

        cardNumber = (cardNumber + '').replace(/\D/g, '');
        for (let i = 0, len = this.cards.length; i < len; i++) {
            card = this.cards[i];
            ref = card.patterns;

            for (let j = 0, len1 = ref.length; j < len1; j++) {
                pattern = ref[j];
                p = pattern + '';

                if (cardNumber.substr(0, p.length) === p) {
                    return card;
                }
            }
        }
    }

    restrictNumeric(e: any): boolean {
        let input: string;
        if (e.metaKey || e.ctrlKey) {
            return true;
        }
        if (e.which === 32) {
            return false;
        }
        if (e.which === 0) {
            return true;
        }
        if (e.which === 42) {  // *
            return true;
        }
        if (e.which < 33) {
            return true;
        }
        input = String.fromCharCode(e.which);
        return !!/[\d\s]/.test(input);
    }

    hasTextSelected(target: any): boolean {
        return target.selectionStart !== null && target.selectionStart !== target.selectionEnd;
    }

    cardType(cardNumber: string): string {
        if (!cardNumber) {
            return cardNumber;
        }

        let card = this.cardFromNumber(cardNumber);

        if (card !== null && typeof card !== 'undefined') {
            return card.type;
        } else {
            return null;
        }
    }

    formatCardNumber(cardNumber: string): string {
        let card: any,
            groups: any,
            upperLength: number;

        cardNumber = cardNumber.replace(/\D/g, '');
        card = this.cardFromNumber(cardNumber);

        if (!card) {
            return cardNumber;
        }

        upperLength = card.length[card.length.length - 1];
        cardNumber = cardNumber.slice(0, upperLength);

        if (card.format.global) {
            let matches = cardNumber.match(card.format);
            if (matches != null) {
                return matches.join(' ');
            }
        } else {
            groups = card.format.exec(cardNumber);
            if (groups == null) {
                return;
            }
            groups.shift();
            delete(groups.index);
            delete(groups.input);
            return groups.join(' ');
        }
    }

    safeVal(value: any, target: any): any {
        let cursor: any = null,
            last = target.value,
            result: any = false;

        try {
            cursor = target.selectionStart;
        } catch (error) {
        }

        target.value = value;

        if (cursor !== null && target === document.activeElement) {
            if (cursor === last.length) {
                cursor = value.length;
            }

            if (last !== value) {
                let prevPair = last.slice(cursor - 1, +cursor + 1 || 9e9),
                    currPair = value.slice(cursor - 1, +cursor + 1 || 9e9),
                    digit = value[cursor];

                if (/\d/.test(digit) && prevPair === (`${digit} `) && currPair === (` ${digit}`)) {
                    cursor = cursor + 1;
                }
            }

            result = cursor;
        }
        return result;
    }

    isCardNumber(key: number, target: any): boolean {
        let card: any,
            digit: string,
            value: string,
            result: boolean;

        digit = String.fromCharCode(key);
        if (!/^\d+$/.test(digit)) {
            return false;
        }
        if (this.hasTextSelected(target)) {
            return true;
        }
        value = (target.value + digit).replace(/\D/g, '');
        card = this.cardFromNumber(value);
        if (card) {
            result = value.length <= card.length[card.length.length - 1];
        } else {
            result = value.length <= 16;
        }

        return result;
    }

    restrictExpiry(key: number, target: any): boolean {
        let digit: string,
            value: string;
        digit = String.fromCharCode(key);
        if (!/^\d+$/.test(digit) || this.hasTextSelected(target)) {
            return false;
        }
        value = `${target.value}${digit}`.replace(/\D/g, '');

        return value.length > 6;
    }

    replaceFullWidthChars(str: string): string {
        if (str === null) {
            str = '';
        }

        let chr: string,
            idx: number,
            fullWidth = '\uff10\uff11\uff12\uff13\uff14\uff15\uff16\uff17\uff18\uff19',
            halfWidth = '0123456789',
            value = '',
            chars = str.split('');

        for (let i = 0; i < chars.length; i++) {
            chr = chars[i];
            idx = fullWidth.indexOf(chr);
            if (idx > -1) {
                chr = halfWidth[idx];
            }
            value += chr;
        }
        return value;
    }

    formatExpiry(expiry: string): string {
        let parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/),
            mon: string,
            sep: string,
            year: string;

        if (!parts) {
            return '';
        }

        mon = parts[1] || '';
        sep = parts[2] || '';
        year = parts[3] || '';

        if (year.length > 0) {
            sep = ' / ';
        } else if (sep === ' /') {
            mon = mon.substring(0, 1);
            sep = '';
        } else if (mon.length === 2 || sep.length > 0) {
            sep = ' / ';
        } else if (mon.length === 1 && (mon !== '0' && mon !== '1')) {
            mon = `0${mon}`;
            sep = ' / ';
        }
        return `${mon}${sep}${year}`;
    }

    restrictCvc(key: number, target: any): boolean {
        let digit = String.fromCharCode(key);
        if (!/^\d+$/.test(digit) || this.hasTextSelected(target)) {
            return false;
        }
        let val = `${target.value}${digit}`;
        return val.length <= 4;
    }

    luhnCheck(cardNumber: string): boolean {
        let digit: number,
            digits = cardNumber.split('').reverse(),
            odd = true,
            sum = 0;

        for (let i = 0; i < digits.length; i++) {
            digit = parseInt(digits[i], 10);
            if ((odd = !odd)) {
                digit *= 2;
            }
            if (digit > 9) {
                digit -= 9;
            }
            sum += digit;
        }

        return sum % 10 === 0;
    }
}
