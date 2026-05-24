import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { GymAffiliateService, GymInfo } from '../../../core/services/gym-affiliate.service';

export type AffiliatePhase = 'scanning' | 'found' | 'done' | 'already_affiliated' | 'error';

@Component({
  selector: 'app-affiliate-gym',
  standalone: false,
  templateUrl: './affiliate-gym.page.html',
  styleUrls: ['./affiliate-gym.page.scss'],
})
export class AffiliateGymPage implements OnInit, OnDestroy {
  phase: AffiliatePhase = 'scanning';
  detectedCode = '';
  gym: GymInfo | null = null;
  errorMessage = '';
  isConfirming = false;
  manualMode = false;
  manualCode = '';
  isNative = false;

  constructor(
    private router: Router,
    private loading: LoadingController,
    private toast: ToastController,
    private auth: AuthService,
    private affiliateService: GymAffiliateService,
    private ngZone: NgZone,
  ) {}

  async ngOnInit() {
    this.isNative = this.affiliateService.isNative();
    if (this.isNative) await this.startRealScanner();
  }

  ngOnDestroy() {
    void this.affiliateService.stopScan();
  }

  // ── Scanner ─────────────────────────────────────────────────

  private async startRealScanner() {
    const supported = await this.affiliateService.isSupported();
    if (!supported) {
      this.setError('Escaneo de QR no soportado en este dispositivo.');
      return;
    }

    await this.affiliateService.startScan(
      // Callbacks arrive from native code, outside Angular zone → run() forces CD
      (gymId) => this.ngZone.run(() => void this.onGymDetected(gymId)),
      (msg)   => this.ngZone.run(() => this.setError(msg)),
    );
  }

  private async onGymDetected(joinCode: string) {
    this.detectedCode = joinCode.toUpperCase();
    this.phase = 'found';
    this.gym = await this.affiliateService.getGymInfo(joinCode);
  }

  // ── Affiliation ──────────────────────────────────────────────

  async confirmAffiliate() {
    const userId = this.auth.currentUser?.id;
    if (!userId) {
      await this.showToast('Usuario no autenticado.', 'danger');
      return;
    }

    this.isConfirming = true;
    const loader = await this.loading.create({ message: 'Procesando…' });
    await loader.present();

    try {
      if (!this.gym) {
        this.setError('Gimnasio no encontrado.');
        return;
      }
      const result = await this.affiliateService.affiliateUserToGym(userId, this.gym.id);

      if (!result.success) {
        this.setError(result.message);
        return;
      }

      this.phase = result.alreadyMember ? 'already_affiliated' : 'done';
      await this.showToast(
        result.message,
        result.alreadyMember ? 'warning' : 'success',
      );
    } finally {
      this.isConfirming = false;
      await loader.dismiss();
    }
  }

  // ── Manual mode ──────────────────────────────────────────────

  enableManual() {
    void this.affiliateService.stopScan();
    this.manualMode = true;
  }

  onManualInput(value: string) {
    this.manualCode = value.trim().toUpperCase();
  }

  submitManual() {
    const code = this.manualCode.trim().toUpperCase();
    if (!this.affiliateService.isValidJoinCode(code)) {
      void this.showToast('El código debe tener 8 caracteres (letras y números).', 'warning');
      return;
    }
    void this.onGymDetected(code);
  }

  // ── Navigation ───────────────────────────────────────────────

  retryScanner() {
    this.phase = 'scanning';
    this.manualMode = false;
    this.manualCode = '';
    this.detectedCode = '';
    this.gym = null;
    this.errorMessage = '';
    if (this.isNative) void this.startRealScanner();
  }

  goHome() {
    this.router.navigate(['/tabs/inicio']);
  }

  goBack() {
    void this.affiliateService.stopScan();
    this.router.navigate(['/tabs/perfil']);
  }

  // ── Helpers ──────────────────────────────────────────────────

  private setError(message: string) {
    this.phase = 'error';
    this.errorMessage = message;
  }

  private async showToast(message: string, color: string) {
    const t = await this.toast.create({
      message,
      duration: 3500,
      position: 'bottom',
      color,
    });
    await t.present();
  }
}
