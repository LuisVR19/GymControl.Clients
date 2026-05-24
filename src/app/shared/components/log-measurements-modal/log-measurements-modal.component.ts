import { Component } from '@angular/core';
import { NgZone } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ProgressService } from '../../../core/services/progress.service';

const toNum = (v: number | null): number | undefined => {
  if (v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
};

@Component({
  selector: 'app-log-measurements-modal',
  standalone: false,
  templateUrl: './log-measurements-modal.component.html',
  styleUrls: ['./log-measurements-modal.component.scss'],
})
export class LogMeasurementsModalComponent {

  saving = false;

  form = {
    weight:     null as number | null,
    bodyFat:    null as number | null,
    neck:       null as number | null,
    chest:      null as number | null,
    waist:      null as number | null,
    hip:        null as number | null,
    leftArm:    null as number | null,
    rightArm:   null as number | null,
    thighLeft:  null as number | null,
    thighRight: null as number | null,
    calfLeft:   null as number | null,
    calfRight:  null as number | null,
  };

  get hasAnyValue(): boolean {
    return Object.values(this.form).some(v => {
      if (v === null || v === undefined) return false;
      const n = Number(v);
      return !Number.isNaN(n) && n > 0;
    });
  }

  constructor(
    private modalCtrl: ModalController,
    private toast: ToastController,
    private progressService: ProgressService,
    private ngZone: NgZone,
  ) {}

  dismiss() { this.modalCtrl.dismiss(null); }

  async save() {
    if (!this.hasAnyValue || this.saving) return;

    this.ngZone.run(() => { this.saving = true; });

    try {
      await this.progressService.saveMeasurements({
        weight:     toNum(this.form.weight),
        bodyFat:    toNum(this.form.bodyFat),
        neck:       toNum(this.form.neck),
        chest:      toNum(this.form.chest),
        waist:      toNum(this.form.waist),
        hip:        toNum(this.form.hip),
        leftArm:    toNum(this.form.leftArm),
        rightArm:   toNum(this.form.rightArm),
        thighLeft:  toNum(this.form.thighLeft),
        thighRight: toNum(this.form.thighRight),
        calfLeft:   toNum(this.form.calfLeft),
        calfRight:  toNum(this.form.calfRight),
      });

      await this.modalCtrl.dismiss({ saved: true });

    } catch (err) {
      console.error('[measurements] save error:', err);
      this.ngZone.run(async () => {
        this.saving = false;
        const t = await this.toast.create({
          message: 'Error al guardar. Intente de nuevo.',
          duration: 3000,
          position: 'bottom',
          color: 'danger',
        });
        await t.present();
      });
    }
  }
}
