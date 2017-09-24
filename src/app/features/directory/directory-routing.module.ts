import { AuthGuard } from '../../core/services/auth-guard.service';
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectoryComponent } from './directory.component';

const routes: Routes = [
    {path: 'directory', component: DirectoryComponent, canActivate: [AuthGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DirectoryRoutingModule {
}
