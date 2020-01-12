import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ToasterService } from 'angular2-toaster';
import { ConfigService } from '../../../app-config.service';
import { AppConfig } from '../../../app-config';

@Component({
    moduleId: module.id,
    templateUrl: 'reset-password.component.html'
})
export class ResetPasswordComponent {
    model: any = {};
    returningMember = false;
    loading = false;
    config: AppConfig;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private toaster: ToasterService,
                private configService: ConfigService,
                private authenticationService: AuthenticationService) {
        this.config = this.configService.config;
    }

    resetPassword() {
        this.loading = true;
        this.authenticationService.resetPassword(this.model.email).subscribe(
            () => {
                this.router.navigate(['reset-password-sent'], {relativeTo: this.route.parent});
            },
            (error: string) => {
                this.toaster.pop('error', 'Password Reset Error', error);
                this.loading = false;
            }
        );
    }
}
