import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User, LayoutService, AuthenticationService } from '../../core';
import { AppConfig } from '../../app-config';
import { ConfigService } from '../../app-config.service';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    // tslint:disable-next-line: component-selector
    selector: 'bhmc-sidebar',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['sidebar.component.css']
})

export class SidebarComponent implements OnInit, AfterViewInit {

    public user?: User;
    public isOpen = false;
    public adminUrl?: string;
    public wikiUrl?: string;
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
        this.wikiUrl = this.config.wikiUrl;
        this._layoutService.sidebarToggle.subscribe(value => this.isOpen = value);
        this._authService.currentUser$.subscribe(user => {
            this.user = user;
        });
        const today = moment();
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
        this._authService.logout();
        this._router.navigate(['/']);
    }
}
