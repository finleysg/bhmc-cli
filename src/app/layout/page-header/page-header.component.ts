import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../core/services/layout.service';
import { ConfigService } from '../../app-config.service';
import { AuthenticationService, User } from '../../core';

@Component({
    moduleId: module.id,
    selector: 'bhmc-header',
    templateUrl: 'page-header.component.html',
    styleUrls: ['page-header.component.css']
})

export class PageHeaderComponent implements OnInit {

    isOpen: boolean = false;
    version: string;
    user: User;

    constructor(private configService: ConfigService,
                private authService: AuthenticationService,
                private _layoutService: LayoutService) {
    }

    ngOnInit(): void {
        this._layoutService.sidebarToggle.subscribe(value => this.isOpen = value);
        this.authService.currentUser$.subscribe(u => this.user = u);
        this.version = this.configService.config.version;
    }

    toggleSidebar() {
        this._layoutService.toggleSidebar();
    }
}
