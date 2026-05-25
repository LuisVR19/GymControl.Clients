import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { MembershipService } from '../../core/services/membership.service';
import { NotificationService } from '../../core/services/notification.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { StatsService } from '../../core/services/stats.service';
import { ThemeService } from '../../core/services/theme.service';
import { LogMeasurementsModalComponent } from '../../shared/components/log-measurements-modal/log-measurements-modal.component';
import { MembershipPlan, TodayWorkout, WeeklyStats } from '../../core/models';
import { DOW_FULL, MONTHS } from '../../core/utils/date.utils';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  plan: MembershipPlan | null = null;
  stats: WeeklyStats = { completed: 0, total: 5, streak: 0 };
  clientName = '';
  gymName    = '';
  loading    = true;
  todayWorkout: TodayWorkout | null = null;
  notifCount = 0;

  readonly todayLabel = (() => {
    const d = new Date();
    return `${DOW_FULL[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  })();

  constructor(
    private auth: AuthService,
    private membership: MembershipService,
    private notifService: NotificationService,
    private statsService: StatsService,
    private schedule: ScheduleService,
    public theme: ThemeService,
    private router: Router,
    private toast: ToastController,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.clientName = this.auth.currentProfile?.name ?? '';
    this.gymName    = this.auth.currentGym?.name ?? '';
    this.auth.profile$.subscribe(p => { if (p) this.clientName = p.name ?? ''; });
    this.auth.gym$.subscribe(g => { this.gymName = g?.name ?? ''; });
    this.load();
  }

  ionViewWillEnter() {
    this.notifService.getUnreadCount().then(c => (this.notifCount = c));
  }

  async doRefresh(event: Event) {
    await this.load();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async load() {
    this.loading = true;
    try {
      const [plan, stats, todayWorkout, notifCount] = await Promise.all([
        this.membership.getActiveMembership(),
        this.statsService.getWeeklyStats(),
        this.schedule.getTodayWorkout(),
        this.notifService.getUnreadCount(),
      ]);
      this.plan         = plan;
      this.stats        = stats;
      this.todayWorkout = todayWorkout;
      this.notifCount   = notifCount;
    } catch {
      this.showToast('Error al cargar datos');
    } finally {
      this.loading = false;
    }
  }

  get weekDots(): number[] {
    return Array.from({ length: this.stats.total }, (_, i) => i < this.stats.completed ? 1 : 0);
  }

  goToWorkout() {
    if (this.todayWorkout) {
      this.router.navigate(['/tabs/rutinas/detail', this.todayWorkout.routineId], {
        queryParams: { day: this.todayWorkout.dayNumber, active: '1' },
      });
    } else {
      this.router.navigate(['/tabs/rutinas']);
    }
  }

  goToProfile() {
    this.router.navigate(['/tabs/perfil']);
  }

  openGymInfo() {
    this.router.navigate(['/tabs/inicio/gym-info']);
  }

  async openMeasurementsModal() {
    const modal = await this.modalCtrl.create({
      component: LogMeasurementsModalComponent,
      cssClass: 'measurements-sheet',
    });
    await modal.present();
  }

  private async showToast(message: string) {
    const t = await this.toast.create({ message, duration: 3000, position: 'bottom', color: 'danger' });
    await t.present();
  }
}
