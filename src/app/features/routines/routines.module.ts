import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RoutinesPageRoutingModule } from './routines-routing.module';
import { RoutinesPage } from './routines.page';
import { WorkoutPage } from './workout/workout.page';
import { RoutineDetailPage } from './detail/routine-detail.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, IonicModule, RoutinesPageRoutingModule, SharedModule],
  declarations: [RoutinesPage, WorkoutPage, RoutineDetailPage],
})
export class RoutinesPageModule {}
