import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoliciesComponent }    from './policies.component';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: ':category', component: PoliciesComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PoliciesRoutingModule { }
