import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { RoutineService } from '../../core/services/routine.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { Routine } from '../../core/models';

@Component({
  selector: 'app-routines',
  standalone: false,
  templateUrl: './routines.page.html',
  styleUrls: ['./routines.page.scss'],
})
export class RoutinesPage implements OnInit {
  routines: Routine[] = [];
  program = '';
  programNote = '';
  loading = true;

  constructor(
    private routineService: RoutineService,
    private scheduleService: ScheduleService,
    private router: Router,
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
      const [routines, todaySchedule] = await Promise.all([
        this.routineService.getMyRoutines(),
        this.scheduleService.getTodaySchedule(),
      ]);

      this.routines = routines.map(r => ({
        ...r,
        active: todaySchedule != null
          && r.routineId === todaySchedule.routineId
          && r.dayNumber === todaySchedule.dayNumber,
      }));

      const active = this.routines.find(r => r.active);
      if (active?.program) this.program = active.program;
    } catch {
      this.showToast('Error al cargar rutinas');
    } finally {
      this.loading = false;
    }
  }

  openDetail(routine: Routine) {
    this.router.navigate(['/tabs/rutinas/detail', routine.routineId], {
      queryParams: {
        day:    routine.dayNumber,
        active: routine.active ? '1' : '0',
        label:  routine.dayLabel,
      },
    });
  }

  private async showToast(message: string) {
    const t = await this.toast.create({ message, duration: 3000, position: 'bottom', color: 'danger' });
    await t.present();
  }
}
