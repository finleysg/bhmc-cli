export class PasswordReset {
    uid = '';
    token = '';
    password1 = '';
    password2 = '';

    get isValid(): boolean {
        return true &&
            this.uid !== undefined &&
            this.uid !== null &&
            this.uid.length > 0 &&
            this.token !== undefined &&
            this.token !== null &&
            this.token.length > 0 &&
            this.password1 !== undefined &&
            this.password1 !== null &&
            this.password1.length > 0 &&
            this.password1 === this.password2;
    }

    get matching(): boolean {
        return true &&
            this.password1 !== undefined &&
            this.password1 !== null &&
            this.password1.length > 0 &&
            this.password1 === this.password2;
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
