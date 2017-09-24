import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, PasswordReset } from '../../../core';
import { ToasterService } from 'angular2-toaster';

@Component({
    moduleId: module.id,
    templateUrl: 'change-password.component.html'
})

export class ChangePasswordComponent implements OnInit {

    model: PasswordReset;
    loading: boolean;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private toaster: ToasterService,
        private authService: AuthenticationService) { }

    ngOnInit() {
        this.model = new PasswordReset();
    }

    updatePassword() {
        if (this.model.matching) {
            this.loading = true;
            this.authService.changePassword(this.model.password1, this.model.password2)
                .then(() => {
                    this.toaster.pop('success', 'Password Change Complete', 'Your password has been changed');
                    this.router.navigate(['settings'], {relativeTo: this.route.parent});
                })
                .catch((err: string) => {
                    this.loading = false;
                    this.toaster.pop('error', 'Password Change Error', err);
                });
        }
    }
}
