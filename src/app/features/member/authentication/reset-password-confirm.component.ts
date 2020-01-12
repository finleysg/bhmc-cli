import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, PasswordReset } from '../../../core';
import { ToasterService } from 'angular2-toaster';

@Component({
    moduleId: module.id,
    templateUrl: 'reset-password-confirm.component.html'
})

export class ResetPasswordConfirmComponent implements OnInit {

    model: PasswordReset;
    invalid = false;
    loading = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private toaster: ToasterService,
        private authService: AuthenticationService) {

        this.model = new PasswordReset();
    }

    ngOnInit() {
        this.model.uid = this.route.snapshot.params['uid'];
        this.model.token = this.route.snapshot.params['token'];
    }

    updatePassword() {
        this.invalid = !this.model.isValid;
        if (!this.invalid) {
            this.loading = true;
            this.authService.confirmReset(this.model).subscribe(
                () => {
                    this.router.navigate(['reset-password-complete'], {relativeTo: this.route.parent});
                },
                (err: string) => {
                    this.loading = false;
                    this.toaster.pop('error', 'Password Reset Error', err);
                }
            );
        }
    }
}
