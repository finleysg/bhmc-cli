import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoliciesComponent }    from './policies.component';
import { AboutUsComponent }     from './about-us.component';

const routes: Routes = [
    {
        path: 'policies',
        children: [
            { path: ':category', component: PoliciesComponent },
        ]
    },
    { path: 'about-us', component: AboutUsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PoliciesRoutingModule { }
