import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SavedCard, User, AuthenticationService } from '../../../core';

@Component({
    moduleId: module.id,
    templateUrl: 'account.component.html',
    styleUrls: ['account.component.css']
})
export class AccountComponent implements OnInit {

    savedCard: SavedCard;
    user: User;

    constructor(private router: Router,
                private authService: AuthenticationService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => this.user = user);
        if (!this.route.firstChild) {
            this.router.navigate(['info'], { relativeTo: this.route, replaceUrl: true });
        }
    }

    updateProfilePicture() {
        // TODO: alert with info about future use
        // TODO: change pic to a golfer
    }
}
