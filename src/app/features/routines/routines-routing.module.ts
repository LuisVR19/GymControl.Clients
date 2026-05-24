import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutinesPage } from './routines.page';
import { WorkoutPage } from './workout/workout.page';
import { RoutineDetailPage } from './detail/routine-detail.page';

const routes: Routes = [
  { path: '', component: RoutinesPage },
  { path: 'detail/:routineId', component: RoutineDetailPage },
  { path: 'workout/:routineId', component: WorkoutPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutinesPageRoutingModule {}
