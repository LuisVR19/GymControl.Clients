import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutinesPage } from './routines.page';
import { WorkoutPage } from './workout/workout.page';
import { WorkoutSimplePage } from './workout-simple/workout-simple.page';
import { RoutineDetailPage } from './detail/routine-detail.page';

const routes: Routes = [
  { path: '', component: RoutinesPage },
  { path: 'detail/:routineId', component: RoutineDetailPage },
  { path: 'workout/:routineId', component: WorkoutPage },
  { path: 'workout-simple/:routineId', component: WorkoutSimplePage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutinesPageRoutingModule {}
