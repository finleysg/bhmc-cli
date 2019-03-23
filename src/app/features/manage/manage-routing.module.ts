import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DropPlayerComponent } from './drop-player/drop-player.component';
import { MovePlayerComponent } from './move-player/move-player.component';
import { AddPlayerComponent } from './add-player/add-player.component';
import { ManageMenuComponent } from './manage-menu/manage-menu.component';
import { EventDetailResolver } from '../../core';
import { ManageLandingComponent } from './manage-landing.component';

const routes: Routes = [
    {
        path: '', component: ManageLandingComponent, children: [
            {
                path: ':id', resolve: { eventDetail: EventDetailResolver }, children: [
                    { path: 'options', component: ManageMenuComponent },
                    { path: 'add', component: AddPlayerComponent },
                    { path: 'drop', component: DropPlayerComponent },
                    { path: 'move', component: MovePlayerComponent }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ManageRoutingModule { }
