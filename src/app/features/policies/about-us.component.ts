import { Policy, PolicyCategory } from './policy';
import { PolicyService } from './policy.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService, User } from '../../core';
import { ConfigService } from '../../app-config.service';
import { AppConfig } from '../../app-config';

@Component({
    moduleId: module.id,
    templateUrl: 'about-us.component.html'
})
export class AboutUsComponent implements OnInit {

    public policies: Policy[];
    public currentUser: User;
    public config: AppConfig;

    constructor(private policyService: PolicyService,
                private configService: ConfigService,
                private authService: AuthenticationService) {
    }

    ngOnInit(): void {
        this.currentUser = this.authService.user;
        this.config = this.configService.config;
        this.policies = [];
        this.policyService.loadPolicies(PolicyCategory.AboutUs).subscribe(p => this.policies.push(p));
    }
}
