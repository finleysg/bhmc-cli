import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core';
import { ToasterService } from 'angular2-toaster';
import { ConfigService } from '../../../app-config.service';
import { AppConfig } from '../../../app-config';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent {
    model: any = {
        username: '',
        password: '',
        remember: true
    };
    loading = false;
    returnUrl?: string;
    config: AppConfig;

    constructor(private router: Router,
                private toaster: ToasterService,
                private configService: ConfigService,
                private authenticationService: AuthenticationService) {
        this.returnUrl = '/home';  // this.authenticationService.redirectUrl || '/';
        this.config = this.configService.config;
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password, this.model.remember).subscribe(
            () => this.router.navigate([this.returnUrl]),
            (err: string) => {
                this.loading = false;
                if (err.indexOf('disabled') > 0) {
                    this.toaster.pop(
                        'error',
                        'Inactive Account',
                        'You\'re account is inactive. Contact the board or site admin to reactivate your account.');
                } else {
                    this.toaster.pop('error', 'Invalid Credentials', err);
                }
            }
        );
    }
}
