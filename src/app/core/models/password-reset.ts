export class PasswordReset {
    uid: string;
    token: string;
    password1: string;
    password2: string;

    get isValid(): boolean {
        return this.uid && this.token && this.password1 && this.password1 === this.password2;
    }

    get matching(): boolean {
        return this.password1 && this.password1 === this.password2;
    }

    toJson(): any {
        return {
            'uid': this.uid,
            'token': this.token,
            'new_password1': this.password1,
            'new_password2': this.password2
        }
    }
}
