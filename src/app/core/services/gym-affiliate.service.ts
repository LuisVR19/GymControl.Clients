import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';
import {
  BarcodeFormat,
  BarcodeScanner,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';
import { supabase } from '../supabase.client';
import { AuthService } from './auth.service';

// ── Public types ──────────────────────────────────────────────

export interface GymInfo {
  id: string;
  name: string;
}

export interface AffiliateResult {
  success: boolean;
  alreadyMember?: boolean;
  message: string;
}

// ── Service ───────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class GymAffiliateService {
  private readonly PREFIX = 'gym_join:';
  private readonly JOIN_CODE_RE = /^[A-Z0-9]{8}$/i;

  private listenerHandle: PluginListenerHandle | null = null;
  private errorListenerHandle: PluginListenerHandle | null = null;

  constructor(private auth: AuthService) {}

  // ── Platform ────────────────────────────────────────────────

  isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  async isSupported(): Promise<boolean> {
    if (!this.isNative()) return false;
    const { supported } = await BarcodeScanner.isSupported();
    return supported;
  }

  // ── QR parsing / validation ──────────────────────────────────

  /**
   * Returns the gym UUID if the payload is a valid `gym_join:<UUID>` string,
   * null if it starts with the prefix but has an invalid UUID,
   * or undefined if it is not a gym QR at all (scanner keeps running).
   */
  parseQrPayload(raw: string): string | null | undefined {
    if (!raw.startsWith(this.PREFIX)) return undefined; // not a gym QR → ignore
    const code = raw.slice(this.PREFIX.length).trim();
    return this.JOIN_CODE_RE.test(code) ? code.toUpperCase() : null;
  }

  isValidJoinCode(value: string): boolean {
    return this.JOIN_CODE_RE.test(value.trim());
  }

  // ── Camera / scanner ─────────────────────────────────────────

  async startScan(
    onDetected: (gymId: string) => void,
    onError: (message: string) => void,
  ): Promise<void> {
    const { camera } = await BarcodeScanner.requestPermissions();
    if (camera !== 'granted' && camera !== 'limited') {
      onError('Permiso de cámara denegado. Habilitalo en los ajustes del dispositivo.');
      return;
    }

    let fired = false;

    this.listenerHandle = await BarcodeScanner.addListener(
      'barcodesScanned',
      (event) => {
        if (fired || !event.barcodes.length) return;
        const raw = event.barcodes[0].rawValue ?? '';
        const result = this.parseQrPayload(raw);

        if (result === undefined) return; // unrelated QR — keep scanning

        fired = true;
        void this.stopScan();

        if (result === null) {
          onError('El código QR no es válido.');
        } else {
          onDetected(result);
        }
      },
    );

    this.errorListenerHandle = await BarcodeScanner.addListener(
      'scanError',
      (event) => {
        void this.stopScan();
        onError(event.message ?? 'Error al acceder a la cámara.');
      },
    );

    document.body.classList.add('qr-scanner-active');

    await BarcodeScanner.startScan({
      formats: [BarcodeFormat.QrCode],
      lensFacing: LensFacing.Back,
    });
  }

  async stopScan(): Promise<void> {
    if (this.listenerHandle) {
      await this.listenerHandle.remove();
      this.listenerHandle = null;
    }
    if (this.errorListenerHandle) {
      await this.errorListenerHandle.remove();
      this.errorListenerHandle = null;
    }
    document.body.classList.remove('qr-scanner-active');
    try {
      await BarcodeScanner.stopScan();
    } catch {
      // already stopped — ignore
    }
  }

  // ── Gym info ─────────────────────────────────────────────────

  async getGymInfo(joinCode: string): Promise<GymInfo | null> {
    const { data } = await supabase
      .from('gyms')
      .select('id, name')
      .eq('join_code', joinCode.toUpperCase())
      .single();
    return data ? { id: data['id'] as string, name: data['name'] as string } : null;
  }

  // ── Affiliation ───────────────────────────────────────────────

  /**
   * Verifies if the user is already a member, creates the affiliation when not,
   * and reloads the global auth profile so the rest of the app reflects the change.
   */
  async affiliateUserToGym(userId: string, gymId: string): Promise<AffiliateResult> {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('gym_id')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        return { success: false, message: 'No se pudo completar la afiliación.' };
      }

      if (profile['gym_id'] === gymId) {
        return { success: true, alreadyMember: true, message: 'Ya perteneces a este gimnasio.' };
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ gym_id: gymId })
        .eq('id', userId);

      if (updateError) {
        return { success: false, message: 'No se pudo completar la afiliación.' };
      }

      // Refresh global profile state so every subscriber sees the new gym_id immediately
      await this.auth.reloadProfile();

      return { success: true, alreadyMember: false, message: 'Te has afiliado correctamente al gimnasio.' };
    } catch {
      return { success: false, message: 'No se pudo completar la afiliación.' };
    }
  }
}
