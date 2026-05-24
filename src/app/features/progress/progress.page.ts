import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ProgressService } from '../../core/services/progress.service';
import { WorkoutService } from '../../core/services/workout.service';
import { LogMeasurementsModalComponent } from '../../shared/components/log-measurements-modal/log-measurements-modal.component';
import { Measurement } from '../../core/models';

@Component({
  selector: 'app-progress',
  standalone: false,
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage implements OnInit {
  activeTab = 1;
  tabs = ['Semana', 'Mes', '3 Meses', 'Año'];

  weightData:  number[] = [];
  bodyFatData: number[] = [];
  volumeData:  number[] = [];
  measurements: Measurement[] = [];
  loading = true;

  constructor(
    private progress: ProgressService,
    private workout: WorkoutService,
    private toast: ToastController,
    private modalCtrl: ModalController,
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
      const [w, f, v, m] = await Promise.all([
        this.progress.getWeightData(),
        this.progress.getBodyFatData(),
        this.workout.getVolumeData(),
        this.progress.getMeasurements(),
      ]);
      this.weightData   = w;
      this.bodyFatData  = f;
      this.volumeData   = v;
      this.measurements = m;
    } catch {
      this.showToast('Error al cargar progreso');
    } finally {
      this.loading = false;
    }
  }

  get currentWeight(): number {
    return this.weightData[this.weightData.length - 1] ?? 0;
  }

  get weightDelta(): string {
    if (this.weightData.length < 2) return '';
    const diff = this.currentWeight - this.weightData[0];
    return (diff >= 0 ? '+' : '') + diff.toFixed(1) + ' kg';
  }

  get currentBodyFat(): number {
    return this.bodyFatData[this.bodyFatData.length - 1] ?? 0;
  }

  get bodyFatDelta(): string {
    if (this.bodyFatData.length < 2) return '';
    const diff = this.currentBodyFat - this.bodyFatData[0];
    return (diff >= 0 ? '+' : '') + diff.toFixed(1) + '%';
  }

  get currentVolume(): number {
    return this.volumeData[this.volumeData.length - 1] ?? 0;
  }

  async openMeasurementsModal() {
    const modal = await this.modalCtrl.create({
      component: LogMeasurementsModalComponent,
      cssClass: 'measurements-sheet',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      const [m, w] = await Promise.all([
        this.progress.getMeasurements(),
        this.progress.getWeightData(),
      ]);
      this.measurements = m;
      this.weightData   = w;
    }
  }

  private async showToast(message: string) {
    const t = await this.toast.create({ message, duration: 3000, position: 'bottom', color: 'danger' });
    await t.present();
  }
}
