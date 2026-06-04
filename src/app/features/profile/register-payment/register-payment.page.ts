import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PaymentService, MembershipInfo } from '../../../core/services/payment.service';

@Component({
  selector: 'app-register-payment',
  standalone: false,
  templateUrl: './register-payment.page.html',
  styleUrls: ['./register-payment.page.scss'],
})
export class RegisterPaymentPage implements OnInit {
  @ViewChild('proofInput') proofInputRef!: ElementRef<HTMLInputElement>;

  method: 'sinpe' | 'transfer' = 'sinpe';
  months     = 1;
  reference  = '';
  image: { url: string; name: string; file: File } | null = null;
  sent        = false;
  saving      = false;
  initLoading = true;
  membership: MembershipInfo | null = null;
  membershipError = false;
  copyFeedback: { [key: string]: boolean } = {};

  readonly gymInfo = {
    sinpe:    { number: '8712 3456', holder: 'Forja Fitness S.R.L.', bank: 'BAC Credomatic' },
    transfer: { bank: 'Banco Nacional de Costa Rica', iban: 'CR05 0151 0202 0012 3456 78', holder: 'Forja Fitness S.R.L.', ced: '3-101-789456' },
  };

  constructor(
    private router:     Router,
    private toast:      ToastController,
    private paymentSvc: PaymentService,
  ) {}

  async ngOnInit() {
    this.initLoading = true;
    this.membership      = await this.paymentSvc.getMembershipInfo();
    this.membershipError = !this.membership;
    this.initLoading     = false;
  }

  // ── Computed ──────────────────────────────────────────────────

  get totalAmount(): number {
    return (this.membership?.pricePerMonth ?? 0) * this.months;
  }

  get amtFormatted(): string { return this.totalAmount.toLocaleString('es-CR'); }

  get coverageStart(): Date {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const nextStr = this.membership?.nextPaymentDate;
    if (!nextStr) return today;
    const [y, m, d] = nextStr.split('-').map(Number);
    const next = new Date(y, m - 1, d);
    // Same as dashboard: start = nextPayment > today ? nextPayment : today
    return next > today ? next : today;
  }

  get coverageEnd(): Date {
    const end = new Date(this.coverageStart);
    end.setMonth(end.getMonth() + this.months);
    end.setDate(end.getDate() - 1);
    return end;
  }

  get periodFormatted(): string {
    const fmt = (d: Date) => d.toLocaleDateString('es-CR', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${fmt(this.coverageStart)} – ${fmt(this.coverageEnd)}`;
  }

  get canSend(): boolean { return !!this.image && !!this.membership && this.months >= 1 && !this.saving; }
  get dbMethod(): string { return this.method === 'sinpe' ? 'sinpe' : 'transferencia'; }

  // ── Actions ───────────────────────────────────────────────────

  addMonth()    { this.months++; }
  removeMonth() { if (this.months > 1) this.months--; }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.image = { url: URL.createObjectURL(file), name: file.name, file };
  }

  triggerFilePicker(): void { this.proofInputRef?.nativeElement.click(); }
  removeImage(): void { this.image = null; }

  copy(value: string, key: string): void {
    try { navigator.clipboard?.writeText(value.replace(/\s+/g, '')); } catch {}
    this.copyFeedback[key] = true;
    setTimeout(() => { this.copyFeedback[key] = false; }, 1400);
  }

  async submit(): Promise<void> {
    if (!this.canSend || !this.membership || !this.image) return;
    this.saving = true;
    try {
      const today = new Date();
      const paymentDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      await this.paymentSvc.submitPaymentProof({
        membershipId: this.membership.id,
        monthsPaid:   this.months,
        amount:       this.totalAmount,
        method:       this.dbMethod,
        paymentDate,
        notes:        this.reference.trim() || null,
        proofFile:    this.image.file,
      });

      this.sent = true;
    } catch (err: any) {
      const t = await this.toast.create({
        message:  err?.message ?? 'Error al enviar el comprobante',
        duration: 4000, position: 'bottom', color: 'danger',
      });
      await t.present();
    } finally {
      this.saving = false;
    }
  }

  goBack(): void { this.router.navigate(['/tabs/perfil/payment-history']); }
}
