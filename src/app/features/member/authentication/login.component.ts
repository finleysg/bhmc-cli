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
export class LoginComponent implements OnInit {
    model: any = {
        username: '',
        password: '',
        remember: true
    };
    loading = false;
    returnUrl: string;
    config: AppConfig;

    constructor(private router: Router,
                private toaster: ToasterService,
                private configService: ConfigService,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        // get return url from the auth service or default to '/'
        this.returnUrl = this.authenticationService.redirectUrl || '/';
        this.config = this.configService.config;
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password, this.model.remember)
            .then(() => this.router.navigate([this.returnUrl]))
            .catch((err: string) => {
                this.loading = false;
                if (err.indexOf('disabled') > 0) {
                    this.toaster.pop('error', 'Inactive Account', 'You\'re account is inactive. Register now for the new season!');
                } else {
                    this.toaster.pop('error', 'Invalid Credentials', err);
                }
            });
    }
}
