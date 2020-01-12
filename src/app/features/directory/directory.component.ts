import { Component, OnInit } from '@angular/core';
import { PublicMember, MemberService } from '../../core';
import { ToasterService } from 'angular2-toaster';
import { forkJoin } from 'rxjs';

@Component({
    moduleId: module.id,
    templateUrl: 'directory.component.html',
    styleUrls: ['directory.component.css']
})
export class DirectoryComponent implements OnInit {

    private members: PublicMember[] = [];
    public friends: PublicMember[] = [];
    public results: PublicMember[] = [];
    public search: any;

    constructor(private memberService: MemberService,
                private toaster: ToasterService) {
        this.search = {
            text: ''
        };
    }

    ngOnInit() {
        forkJoin([
            this.memberService.getMembers(),
            this.memberService.friends()
        ]).subscribe(
            results => {
                this.members = results[0].filter(m => m.isActive);
                this.friends = results[1];
                this.members.forEach(m => {
                    m.isFriend = this.friends.some(f => {
                        return f.id === m.id;
                    });
                });
            }
        );
    }

    doFilter(pattern: string) {
        if (pattern && pattern.length > 1) {
            pattern = pattern.toLowerCase();
            this.results = this.members.filter(m => {
                return m.name.toLowerCase().indexOf(pattern) >= 0;
            });
        }
    }

    toggleFriendship(member: PublicMember) {
        if (member.isFriend) {
            this.memberService.removeFriend(member).subscribe(
                () => {
                    member.isFriend = false;
                    const fx = this.friends.findIndex(f => f.id === member.id);
                    this.friends.splice(fx, 1);
                    this.toaster.pop('warning', 'Friends List', `${member.name} has been removed from your friends list`);
                }
            );
        } else {
            this.memberService.addFriend(member).subscribe(
                () => {
                    member.isFriend = true;
                    this.friends.push(member);
                    this.toaster.pop('success', 'Friends List', `${member.name} has been added to your friends list`);
                }
            );
        }
    }
}
