import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SparklineComponent } from './components/sparkline/sparkline.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { GymBadgeComponent } from './components/gym-badge/gym-badge.component';
import { LogMeasurementsModalComponent } from './components/log-measurements-modal/log-measurements-modal.component';
import { AssignRoutineModalComponent } from './components/assign-routine-modal/assign-routine-modal.component';
import { ExerciseDetailModalComponent } from './components/exercise-detail-modal/exercise-detail-modal.component';

@NgModule({
  declarations: [SparklineComponent, BarChartComponent, AvatarComponent, GymBadgeComponent, LogMeasurementsModalComponent, AssignRoutineModalComponent, ExerciseDetailModalComponent],
  exports: [SparklineComponent, BarChartComponent, AvatarComponent, GymBadgeComponent, LogMeasurementsModalComponent, AssignRoutineModalComponent, ExerciseDetailModalComponent],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SharedModule {}
