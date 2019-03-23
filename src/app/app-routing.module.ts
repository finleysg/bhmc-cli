import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'about-us', loadChildren: './features/about-us/about-us.module#AboutUsModule' },
  { path: 'contact', loadChildren: './features/contact/contact.module#ContactModule' },
  { path: 'calendar', loadChildren: './features/calendar/calendar.module#CalendarModule' },
  { path: 'dam-cup', loadChildren: './features/dam-cup/dam-cup.module#DamCupModule' },
  { path: 'directory', loadChildren: './features/directory/directory.module#DirectoryModule' },
  { path: 'events', loadChildren: './features/events/events.module#EventsModule' },
  { path: 'manage', loadChildren: './features/manage/manage.module#ManageModule' },
  { path: 'member', loadChildren: './features/member/member.module#MemberModule' },
  { path: 'policies', loadChildren: './features/policies/policies.module#PoliciesModule' },
  { path: 'results', loadChildren: './features/results/results.module#ResultsModule' },
  { path: 'season-points', loadChildren: './features/season-points/season-points.module#SeasonPointsModule' },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
