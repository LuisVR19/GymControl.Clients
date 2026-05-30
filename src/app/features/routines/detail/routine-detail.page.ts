import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { RoutineService } from '../../../core/services/routine.service';
import { Exercise } from '../../../core/models';
import { ExerciseDetailModalComponent } from '../../../shared/components/exercise-detail-modal/exercise-detail-modal.component';

@Component({
  selector: 'app-routine-detail',
  standalone: false,
  templateUrl: './routine-detail.page.html',
  styleUrls: ['./routine-detail.page.scss'],
})
export class RoutineDetailPage implements OnInit {

  routineId    = '';
  dayNumber    = 1;
  routineName  = 'Rutina';
  dayLabel     = '';
  active       = false;
  exercises: Exercise[] = [];
  loading = true;

  get setsCount(): number {
    return this.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  }

  get exercisesCount(): number {
    return this.exercises.length;
  }

  get estimatedMins(): number {
    return Math.max(10, Math.round((this.setsCount * 2.5) / 5) * 5);
  }

  // Used only for muscle pills summary at the top
  get exerciseGroups(): { muscle: string; exercises: Exercise[] }[] {
    const map = new Map<string, Exercise[]>();
    for (const ex of this.exercises) {
      const key = ex.muscle || 'Otro';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ex);
    }
    return Array.from(map.entries()).map(([muscle, exercises]) => ({ muscle, exercises }));
  }

  private readonly SS_LETTERS = ['A', 'B', 'C', 'D', 'E'];
  private readonly SS_COLORS  = ['#3b82f6', '#22c55e', '#f97316', '#8b5cf6', '#ef4444'];

  supersetLetter(g: number): string {
    return this.SS_LETTERS[(g - 1) % 5];
  }

  supersetColor(g: number): string {
    return this.SS_COLORS[(g - 1) % 5];
  }

  supersetColorBg(g: number): string {
    const hex = this.SS_COLORS[(g - 1) % 5];
    const r = parseInt(hex.slice(1, 3), 16);
    const gv = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${gv},${b},0.15)`;
  }

  constructor(
    private routineService: RoutineService,
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.routineId = this.route.snapshot.paramMap.get('routineId') ?? '';
    this.dayNumber = Number(this.route.snapshot.queryParamMap.get('day') ?? 1);
    this.active    = this.route.snapshot.queryParamMap.get('active') === '1';
    this.dayLabel  = this.route.snapshot.queryParamMap.get('label') ?? '';
    this.load();
  }

  private async load() {
    this.loading = true;
    try {
      if (this.routineId) {
        const [exercises, name] = await Promise.all([
          this.routineService.getWorkoutExercises(this.routineId, this.dayNumber),
          this.routineService.getRoutineName(this.routineId),
        ]);
        this.exercises   = exercises;
        this.routineName = name;
      }
    } finally {
      this.loading = false;
    }
  }

  async openExerciseDetail(exercise: Exercise) {
    const modal = await this.modalCtrl.create({
      component: ExerciseDetailModalComponent,
      componentProps: { exercise },
      cssClass: 'exercise-detail-sheet',
    });
    await modal.present();
  }

  goBack() {
    this.router.navigate(['/tabs/rutinas']);
  }

  startWorkout() {
    this.router.navigate(['/tabs/rutinas/workout', this.routineId], {
      queryParams: { day: this.dayNumber },
    });
  }

  startSimpleWorkout() {
    this.router.navigate(['/tabs/rutinas/workout-simple', this.routineId], {
      queryParams: { day: this.dayNumber, name: this.routineName },
    });
  }
}
