import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProgressPageRoutingModule } from './progress-routing.module';
import { ProgressPage } from './progress.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, IonicModule, ProgressPageRoutingModule, SharedModule],
  declarations: [ProgressPage],
})
export class ProgressPageModule {}
