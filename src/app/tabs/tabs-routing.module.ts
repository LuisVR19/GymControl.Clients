import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        loadChildren: () =>
          import('../features/home/home.module').then(m => m.HomePageModule),
      },
      {
        path: 'rutinas',
        loadChildren: () =>
          import('../features/routines/routines.module').then(m => m.RoutinesPageModule),
      },
      {
        path: 'progreso',
        loadChildren: () =>
          import('../features/progress/progress.module').then(m => m.ProgressPageModule),
      },
      {
        path: 'agenda',
        loadChildren: () =>
          import('../features/calendar/calendar.module').then(m => m.CalendarPageModule),
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('../features/profile/profile.module').then(m => m.ProfilePageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/inicio',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/inicio',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
