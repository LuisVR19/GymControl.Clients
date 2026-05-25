import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { NotificationsPage } from './notifications/notifications.page';
import { GymInfoPage } from './gym-info/gym-info.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, IonicModule, HomePageRoutingModule, SharedModule],
  declarations: [HomePage, NotificationsPage, GymInfoPage],
})
export class HomePageModule {}
