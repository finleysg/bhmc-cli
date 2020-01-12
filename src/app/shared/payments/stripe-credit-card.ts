declare const Stripe: any;

export class StripeCreditCard {

    private stripe: any;
    number: string;
    exp: string;
    cvc: string;

    constructor () {
        this.stripe = Stripe;
        this.number = '';
        this.exp = '';
        this.cvc = '';
    }

    createToken(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.stripe.card.createToken({
                number: this.number,
                exp: this.exp,
                cvc: this.cvc
            }, (status: number, response: any) => {
                if (status === 200) {
                    resolve(response.id);
                } else {
                    if (response.error && response.error.message) {
                        reject(response.error.message);
                    } else {
                        reject('Could not validate this card');
                    }
                }
            });
        });
    }
}
