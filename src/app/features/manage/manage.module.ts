import { NgModule } from '@angular/core';
import { AddPlayerComponent } from './add-player/add-player.component';
import { DropPlayerComponent } from './drop-player/drop-player.component';
import { MovePlayerComponent } from './move-player/move-player.component';
import { ManageMenuComponent } from './manage-menu/manage-menu.component';
import { SharedModule } from '../../shared/shared.module';
import { ManageRoutingModule } from './manage-routing.module';
import { ManageLandingComponent } from './manage-landing.component';

@NgModule({
  imports: [
    SharedModule,
    ManageRoutingModule
  ],
  declarations: [
    ManageLandingComponent,
    AddPlayerComponent,
    DropPlayerComponent,
    MovePlayerComponent,
    ManageMenuComponent
  ]
})
export class ManageModule { }
