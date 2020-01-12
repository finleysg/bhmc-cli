import { Component, OnInit } from '@angular/core';
import { AuthenticationService, PolicyService, Policy, PolicyCategory, User } from '../../core';
import { ConfigService } from '../../app-config.service';
import { AppConfig } from '../../app-config';

@Component({
    templateUrl: 'about-us.component.html'
})
export class AboutUsComponent implements OnInit {

    public policies: Policy[] = [];
    public currentUser: User;
    public config: AppConfig;

    constructor(private policyService: PolicyService,
                private configService: ConfigService,
                private authService: AuthenticationService) {
        this.config = this.configService.config;
        this.currentUser = this.authService.user;
    }

    ngOnInit(): void {
        this.policies = [];
        this.policyService.loadPolicies(PolicyCategory.AboutUs).subscribe(p => this.policies.push(p));
    }
}
