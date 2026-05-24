import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { RoutineService } from '../../../core/services/routine.service';
import { WorkoutService } from '../../../core/services/workout.service';
import { Exercise, ExerciseSet } from '../../../core/models';

@Component({
  selector: 'app-workout',
  standalone: false,
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
})
export class WorkoutPage implements OnInit, OnDestroy {
  exercises: Exercise[] = [];
  exIdx = 0;
  timerSecs = 0;
  running = true;
  loading = true;
  private timerRef: ReturnType<typeof setInterval> | null = null;

  private routineId: string | null = null;
  private dayNumber: number | undefined;

  get exercise(): Exercise | null {
    return this.exercises[this.exIdx] ?? null;
  }

  get totalSets(): number {
    return this.exercises.reduce((acc, e) => acc + e.sets.length, 0);
  }

  get doneSets(): number {
    return this.exercises.reduce((acc, e) => acc + e.sets.filter(s => s.done).length, 0);
  }

  get progress(): number {
    return this.totalSets ? (this.doneSets / this.totalSets) * 100 : 0;
  }

  get isLast(): boolean {
    return this.exIdx >= this.exercises.length - 1;
  }

  get muscleLabel(): string {
    const muscles = [...new Set(this.exercises.map(e => e.muscle).filter(Boolean))];
    return muscles.slice(0, 2).join(' · ') || 'Entreno';
  }

  get timerFormatted(): string {
    const m = Math.floor(this.timerSecs / 60);
    const s = this.timerSecs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  constructor(
    private routineService: RoutineService,
    private workoutService: WorkoutService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastController,
  ) {}

  ngOnInit() {
    this.routineId = this.route.snapshot.paramMap.get('routineId');
    const day = this.route.snapshot.queryParamMap.get('day');
    this.dayNumber = day != null ? Number(day) : undefined;
    this.load();
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  private async load() {
    this.loading = true;
    try {
      if (this.routineId) {
        this.exercises = await this.routineService.getWorkoutExercises(this.routineId, this.dayNumber);
      }
    } catch {
      this.showToast('Error al cargar ejercicios');
    } finally {
      this.loading = false;
    }
  }

  toggleTimer() {
    this.running = !this.running;
    if (this.running) this.startTimer(); else this.stopTimer();
  }

  private startTimer() {
    this.timerRef = setInterval(() => this.timerSecs++, 1000);
  }

  private stopTimer() {
    if (this.timerRef) { clearInterval(this.timerRef); this.timerRef = null; }
  }

  toggleSet(setIdx: number) {
    if (!this.exercise) return;
    this.exercise.sets[setIdx].done = !this.exercise.sets[setIdx].done;
  }

  updateSet(setIdx: number, key: 'weight' | 'reps', value: string) {
    if (!this.exercise) return;
    this.exercise.sets[setIdx][key] = parseFloat(value) || 0;
  }

  addSet() {
    if (!this.exercise) return;
    const last = this.exercise.sets[this.exercise.sets.length - 1];
    this.exercise.sets.push({ weight: last?.weight ?? 0, reps: last?.reps ?? 10, done: false });
  }

  prevExercise() {
    if (this.exIdx > 0) this.exIdx--;
  }

  async nextOrFinish() {
    if (!this.isLast) {
      this.exIdx++;
    } else {
      await this.finishWorkout();
    }
  }

  private async finishWorkout() {
    this.stopTimer();
    const logs: { exerciseId: string; weight: number; reps: number }[] = [];
    for (const ex of this.exercises) {
      for (const set of ex.sets) {
        if (set.done) {
          logs.push({ exerciseId: ex.id, weight: set.weight, reps: set.reps });
        }
      }
    }
    // Always record at least one entry so the day counts as completed
    if (!logs.length && this.exercises.length) {
      logs.push({ exerciseId: this.exercises[0].id, weight: 0, reps: 0 });
    }
    try {
      await this.workoutService.logWorkout(logs);
    } catch {
      // silent — don't block navigation
    }
    this.router.navigate(['/tabs/rutinas']);
  }

  close() {
    this.stopTimer();
    this.router.navigate(['/tabs/rutinas']);
  }

  private async showToast(message: string) {
    const t = await this.toast.create({ message, duration: 3000, position: 'bottom', color: 'danger' });
    await t.present();
  }
}
