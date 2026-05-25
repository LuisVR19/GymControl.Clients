import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { NotificationsPage } from './notifications/notifications.page';
import { GymInfoPage } from './gym-info/gym-info.page';

const routes: Routes = [
  { path: '',               component: HomePage          },
  { path: 'notificaciones', component: NotificationsPage },
  { path: 'gym-info',       component: GymInfoPage       },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
