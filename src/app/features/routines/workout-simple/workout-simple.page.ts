import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutineService } from '../../../core/services/routine.service';
import { WorkoutService } from '../../../core/services/workout.service';
import { StatsService } from '../../../core/services/stats.service';
import { Exercise } from '../../../core/models';

@Component({
  selector: 'app-workout-simple',
  standalone: false,
  templateUrl: './workout-simple.page.html',
  styleUrls: ['./workout-simple.page.scss'],
})
export class WorkoutSimplePage implements OnInit, OnDestroy {
  exercises: Exercise[] = [];
  checked: boolean[] = [];
  timerSecs = 0;
  loading = true;
  showConfirm = false;
  routineName = '';
  private routineId: string | null = null;
  private dayNumber: number | undefined;
  private timerRef: ReturnType<typeof setInterval> | null = null;

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

  get doneCount(): number { return this.checked.filter(Boolean).length; }

  get totalSeries(): number {
    return this.exercises.reduce((acc, e) => acc + e.sets.length, 0);
  }

  get progress(): number {
    return this.exercises.length ? (this.doneCount / this.exercises.length) * 100 : 0;
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
  ) {}

  ngOnInit() {
    this.routineId   = this.route.snapshot.paramMap.get('routineId');
    const day        = this.route.snapshot.queryParamMap.get('day');
    this.dayNumber   = day != null ? Number(day) : undefined;
    this.routineName = this.route.snapshot.queryParamMap.get('name') ?? 'Rutina';
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
        const [exercises, name] = await Promise.all([
          this.routineService.getWorkoutExercises(this.routineId, this.dayNumber),
          this.routineService.getRoutineName(this.routineId),
        ]);
        this.exercises   = exercises;
        this.routineName = name || this.routineName;
        this.checked     = exercises.map(() => false);
      }
    } finally {
      this.loading = false;
    }
  }

  toggle(i: number) {
    this.checked = this.checked.map((v, j) => j === i ? !v : v);
  }

  private startTimer() {
    this.timerRef = setInterval(() => this.timerSecs++, 1000);
  }

  private stopTimer() {
    if (this.timerRef) { clearInterval(this.timerRef); this.timerRef = null; }
  }

  openConfirm()  { this.showConfirm = true; }
  closeConfirm() { this.showConfirm = false; }

  async confirmFinish() {
    this.showConfirm = false;
    this.stopTimer();
    this.completionDuration = this.timerSecs;

    const logs: { exerciseId: string; weight: number; reps: number }[] = [];
    for (const ex of this.exercises) {
      for (const set of ex.sets) {
        logs.push({ exerciseId: ex.id, weight: set.weight, reps: set.reps });
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
    this.completionTimers.push(setTimeout(() => this.showStreakNum   = true, 900));
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
    this.router.navigate(['/tabs/rutinas/detail', this.routineId], {
      queryParams: { day: this.dayNumber },
    });
  }
}
