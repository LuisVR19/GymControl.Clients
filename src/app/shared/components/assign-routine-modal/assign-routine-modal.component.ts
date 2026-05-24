import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Routine, ScheduleEntry } from '../../../core/models';

@Component({
  selector: 'app-assign-routine-modal',
  standalone: false,
  templateUrl: './assign-routine-modal.component.html',
  styleUrls: ['./assign-routine-modal.component.scss'],
})
export class AssignRoutineModalComponent implements OnInit {
  @Input() routines: Routine[] = [];
  @Input() scheduleByDow = new Map<number, ScheduleEntry>();
  @Input() initialDow?: number;

  step = 1;
  selectedRoutine: Routine | null = null;
  selectedDow: number | null = null;
  selectedTime = '07:00';

  readonly DOW_SHORT  = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  readonly DOW_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  readonly DOW_NUMS   = [1, 2, 3, 4, 5, 6, 7];
  readonly TIMES      = ['06:00', '07:00', '12:00', '17:00', '18:30', '20:00'];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.selectedTime = '07:00';
    if (this.initialDow) {
      this.selectedDow = this.initialDow;
      if (this.scheduleByDow.has(this.initialDow)) {
        const existing = this.scheduleByDow.get(this.initialDow)!;
        const match = this.routines.find(
          r => r.routineId === existing.routineId && r.dayNumber === existing.dayNumber
        );
        if (match) this.selectedRoutine = match;
        this.step = 2;
      }
    }
  }

  selectRoutine(r: Routine) { this.selectedRoutine = r; }

  continue() {
    if (this.step === 1 && this.selectedRoutine) this.step = 2;
  }

  back() {
    if (this.step === 2) this.step = 1;
  }

  async confirm() {
    if (!this.selectedRoutine || !this.selectedDow) return;
    await this.modalCtrl.dismiss({
      routineId: this.selectedRoutine.routineId,
      dayNumber: this.selectedRoutine.dayNumber,
      dow: this.selectedDow,
      time: this.selectedTime,
    });
  }

  async remove() {
    if (!this.selectedDow) return;
    await this.modalCtrl.dismiss({ remove: true, dow: this.selectedDow });
  }

  dismiss() { this.modalCtrl.dismiss(); }

  get selectedDowLabel(): string {
    return this.selectedDow ? this.DOW_LABELS[this.selectedDow - 1] : 'día';
  }

  isOccupied(dow: number): boolean { return this.scheduleByDow.has(dow); }

  get willReplace(): boolean {
    return !!(this.selectedDow && this.scheduleByDow.has(this.selectedDow));
  }

  get canConfirm(): boolean {
    return !!(this.selectedRoutine && this.selectedDow);
  }
}
