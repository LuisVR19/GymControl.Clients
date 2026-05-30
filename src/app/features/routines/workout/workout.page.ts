import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { RoutineService } from '../../../core/services/routine.service';
import { WorkoutService } from '../../../core/services/workout.service';
import { StatsService } from '../../../core/services/stats.service';
import { Exercise, ExerciseSet } from '../../../core/models';
import { ExerciseDetailModalComponent } from '../../../shared/components/exercise-detail-modal/exercise-detail-modal.component';

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

  // Completion overlay state
  showCompletion = false;
  completionDuration = 0;
  completionStreak = 0;
  showStreakNum = false;
  showContinueBtn = false;
  private completionTimers: ReturnType<typeof setTimeout>[] = [];

  readonly confetti = [
    { x: 14, y: 22, d: 0.05, r: -12, c: 'var(--accent)' },
    { x: 82, y: 18, d: 0.12, r: 18,  c: 'var(--ink)' },
    { x: 8,  y: 48, d: 0.20, r: 35,  c: 'var(--accent)' },
    { x: 90, y: 46, d: 0.08, r: -22, c: 'var(--accent)' },
    { x: 20, y: 72, d: 0.28, r: 8,   c: 'var(--ink-2)' },
    { x: 78, y: 70, d: 0.18, r: -30, c: 'var(--accent)' },
    { x: 50, y: 8,  d: 0.00, r: 0,   c: 'var(--accent)' },
    { x: 30, y: 88, d: 0.32, r: 45,  c: 'var(--ink-3)' },
    { x: 68, y: 90, d: 0.24, r: -15, c: 'var(--accent)' },
    { x: 6,  y: 80, d: 0.36, r: 25,  c: 'var(--ink-2)' },
    { x: 92, y: 82, d: 0.22, r: -8,  c: 'var(--accent)' },
    { x: 40, y: 14, d: 0.10, r: 55,  c: 'var(--ink)' },
    { x: 60, y: 14, d: 0.14, r: -40, c: 'var(--accent)' },
    { x: 46, y: 94, d: 0.30, r: 12,  c: 'var(--ink-2)' },
  ];

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
    private statsService: StatsService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastController,
    private modalCtrl: ModalController,
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
    this.completionTimers.forEach(t => clearTimeout(t));
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

  private readonly SS_LETTERS = ['A', 'B', 'C', 'D', 'E'];
  private readonly SS_COLORS  = ['#3b82f6', '#22c55e', '#f97316', '#8b5cf6', '#ef4444'];

  supersetLetter(g: number): string { return this.SS_LETTERS[(g - 1) % 5]; }

  supersetColor(g: number): string { return this.SS_COLORS[(g - 1) % 5]; }

  supersetColorBg(g: number): string {
    const hex = this.SS_COLORS[(g - 1) % 5];
    const r = parseInt(hex.slice(1, 3), 16);
    const gv = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${gv},${b},0.15)`;
  }

  async openExerciseDetail(exercise: Exercise) {
    const modal = await this.modalCtrl.create({
      component: ExerciseDetailModalComponent,
      componentProps: { exercise },
      cssClass: 'exercise-detail-sheet',
    });
    await modal.present();
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
    this.completionDuration = this.timerSecs;

    const logs: { exerciseId: string; weight: number; reps: number }[] = [];
    for (const ex of this.exercises) {
      for (const set of ex.sets) {
        if (set.done) {
          logs.push({ exerciseId: ex.id, weight: set.weight, reps: set.reps });
        }
      }
    }
    if (!logs.length && this.exercises.length) {
      logs.push({ exerciseId: this.exercises[0].id, weight: 0, reps: 0 });
    }
    try {
      await this.workoutService.logWorkout(logs);
      const stats = await this.statsService.getWeeklyStats();
      this.completionStreak = stats.streak;
    } catch { /* silent */ }

    this.showCompletion = true;
    this.completionTimers.push(setTimeout(() => this.showStreakNum  = true, 900));
    this.completionTimers.push(setTimeout(() => this.showContinueBtn = true, 1800));
    this.completionTimers.push(setTimeout(() => this.navigateAfterCompletion(), 4200));
  }

  continueFromCompletion() {
    this.completionTimers.forEach(t => clearTimeout(t));
    this.navigateAfterCompletion();
  }

  private navigateAfterCompletion() {
    this.router.navigate(['/tabs/rutinas']);
  }

  fmtDuration(s: number): string {
    return `${Math.floor(s / 60)} min`;
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
