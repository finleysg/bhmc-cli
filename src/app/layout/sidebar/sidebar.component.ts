import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User, LayoutService, AuthenticationService } from '../../core';
import { AppConfig } from '../../app-config';
import { ConfigService } from '../../app-config.service';
declare const moment: any;

@Component({
    moduleId: module.id,
    selector: 'bhmc-sidebar',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['sidebar.component.css']
})

export class SidebarComponent implements OnInit, AfterViewInit {

    public user: User;
    public isOpen: boolean;
    public adminUrl: string;
    public currentMonth: any;
    public config: AppConfig;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _layoutService: LayoutService,
        private _authService: AuthenticationService,
        private configService: ConfigService
    ) {
        this.config = configService.config;
    }

    ngOnInit(): void {
        this.adminUrl = this.config.adminUrl;
        this._layoutService.sidebarToggle.subscribe(value => this.isOpen = value);
        this._authService.currentUser$.subscribe(user => {
            this.user = user;
        });
        let today = moment();
        this.currentMonth = {
            year: today.year(),
            month: today.format('MMMM').toLowerCase()
        };
    }

    ngAfterViewInit(): void {
        // no-op-for-now
    }

    close(): void {
        this._layoutService.closeSidebar();
    }

    isCurrentRoute(parent: string): boolean {
        if (this._route && this._route.parent) {
            return this._route.parent.toString() === parent;
        }
        return false;
    }

    logout(): void {
        this.close();
        this._authService.logout().then( () => {
            this._router.navigate(['/']);
        });
    }
}
