import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'about-us', loadChildren: () => import('./features/about-us/about-us.module').then(m => m.AboutUsModule) },
  { path: 'contact', loadChildren: () => import('./features/contact/contact.module').then(m => m.ContactModule) },
  { path: 'calendar', loadChildren: () => import('./features/calendar/calendar.module').then(m => m.CalendarModule) },
  { path: 'dam-cup', loadChildren: () => import('./features/dam-cup/dam-cup.module').then(m => m.DamCupModule) },
  { path: 'directory', loadChildren: () => import('./features/directory/directory.module').then(m => m.DirectoryModule) },
  { path: 'events', loadChildren: () => import('./features/events/events.module').then(m => m.EventsModule) },
  { path: 'manage', loadChildren: () => import('./features/manage/manage.module').then(m => m.ManageModule) },
  { path: 'member', loadChildren: () => import('./features/member/member.module').then(m => m.MemberModule) },
  { path: 'policies', loadChildren: () => import('./features/policies/policies.module').then(m => m.PoliciesModule) },
  { path: 'results', loadChildren: () => import('./features/results/results.module').then(m => m.ResultsModule) },
  { path: 'season-points', loadChildren: () => import('./features/season-points/season-points.module').then(m => m.SeasonPointsModule) },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
