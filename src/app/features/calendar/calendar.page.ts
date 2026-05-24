import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AttendanceService } from '../../core/services/attendance.service';
import { RoutineService } from '../../core/services/routine.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { CalendarDay, Routine, ScheduleEntry, UpcomingWorkout } from '../../core/models';
import { AssignRoutineModalComponent } from '../../shared/components/assign-routine-modal/assign-routine-modal.component';
import { MONTHS } from '../../core/utils/date.utils';

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  weekDays = ['L','M','X','J','V','S','D'];
  month: CalendarDay[] = [];
  upcoming: UpcomingWorkout[] = [];
  loading = true;

  readonly DOW_LABELS  = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  readonly DOW_NUMS    = [1, 2, 3, 4, 5, 6, 7];
  readonly skCalDays   = Array.from({ length: 35 });
  scheduleByDow = new Map<number, ScheduleEntry>();
  private availableRoutines: Routine[] = [];
  private timeByDow = new Map<number, string>();

  readonly now = new Date();
  readonly monthLabel = this.now.toLocaleDateString('es-CR', { month: 'long', year: 'numeric' })
    .replace(/^./, c => c.toUpperCase());

  constructor(
    private attendance: AttendanceService,
    private routineService: RoutineService,
    private scheduleService: ScheduleService,
    private modalCtrl: ModalController,
    private toast: ToastController,
  ) {}

  ngOnInit() {
    this.load();
  }

  async doRefresh(event: Event) {
    await this.load();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async load() {
    this.loading = true;
    try {
      const [doneDays, schedule, routines] = await Promise.all([
        this.attendance.getAttendanceDays(this.now.getFullYear(), this.now.getMonth() + 1),
        this.scheduleService.getSchedule(),
        this.routineService.getMyRoutines(),
      ]);

      this.scheduleByDow     = new Map(schedule.map(s => [s.dayOfWeek, s]));
      this.availableRoutines = routines;
      this.upcoming          = this.computeUpcoming(schedule);
      this.buildCalendar(doneDays, this.computePlannedDays(schedule));
    } catch {
      this.buildCalendar(new Set(), new Set());
      this.showToast('Error al cargar agenda');
    } finally {
      this.loading = false;
    }
  }

  private buildCalendar(doneDays: Set<number>, plannedDays: Set<number>) {
    const year  = this.now.getFullYear();
    const month = this.now.getMonth();
    const today = this.now.getDate();
    const offset = (() => {
      const dow = new Date(year, month, 1).getDay();
      return dow === 0 ? 6 : dow - 1;
    })();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.month = Array.from({ length: 35 }, (_, i) => {
      const d = i - offset + 1;
      const valid = d >= 1 && d <= daysInMonth;
      return {
        n:       valid ? d : null,
        done:    valid && doneDays.has(d),
        planned: valid && plannedDays.has(d) && d > today,
        today:   valid && d === today,
      };
    });
  }

  private computePlannedDays(schedule: ScheduleEntry[]): Set<number> {
    const planned     = new Set<number>();
    const year        = this.now.getFullYear();
    const month       = this.now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(year, month, d).getDay();
      const dowNorm = dow === 0 ? 7 : dow;
      if (schedule.some(s => s.dayOfWeek === dowNorm)) planned.add(d);
    }
    return planned;
  }

  private computeUpcoming(schedule: ScheduleEntry[]): UpcomingWorkout[] {
    if (!schedule.length) return [];

    const today    = new Date();
    const todayDow = today.getDay() === 0 ? 7 : today.getDay();

    return [...schedule]
      .sort((a, b) => {
        const da = ((a.dayOfWeek - todayDow) + 7) % 7 || 7;
        const db = ((b.dayOfWeek - todayDow) + 7) % 7 || 7;
        return da - db;
      })
      .slice(0, 3)
      .map(s => {
        const diff = ((s.dayOfWeek - todayDow) + 7) % 7 || 7;
        const next = new Date(today);
        next.setDate(today.getDate() + diff);
        return {
          day:   String(next.getDate()).padStart(2, '0'),
          month: MONTHS[next.getMonth()],
          name:  `${s.routineName} · Día ${s.dayNumber}`,
          time:  this.timeByDow.get(s.dayOfWeek) ?? '07:00',
        };
      });
  }

  async openAssignModal(initialDow?: number) {
    if (!this.availableRoutines.length) {
      this.showToast('No tienes rutinas asignadas aún');
      return;
    }

    const modal = await this.modalCtrl.create({
      component: AssignRoutineModalComponent,
      componentProps: {
        routines:      this.availableRoutines,
        scheduleByDow: this.scheduleByDow,
        initialDow,
      },
      cssClass: 'assign-routine-sheet',
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (!data) return;

    if (data['remove']) {
      this.timeByDow.delete(data['dow']);
      await this.removeAssignment(data['dow']);
    } else {
      if (data['time']) this.timeByDow.set(data['dow'], data['time']);
      await this.saveAssignment(data['routineId'], data['dayNumber'], data['dow']);
    }
  }

  private async saveAssignment(routineId: string, dayNumber: number, dow: number) {
    try {
      await this.scheduleService.assign(routineId, dayNumber, dow);
      await this.load();
    } catch {
      this.showToast('Error al guardar');
    }
  }

  private async removeAssignment(dow: number) {
    try {
      await this.scheduleService.remove(dow);
      await this.load();
    } catch {
      this.showToast('Error al quitar rutina');
    }
  }

  private async showToast(message: string) {
    const t = await this.toast.create({ message, duration: 3000, position: 'bottom', color: 'danger' });
    await t.present();
  }
}
