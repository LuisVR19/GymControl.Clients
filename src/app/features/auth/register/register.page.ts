import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  form!: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastController,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      cedula:   ['', [Validators.required, Validators.minLength(5)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async register() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    try {
      const { cedula, email, password } = this.form.value;
      await this.auth.register(email, password, cedula);
      await this.showToast('Cuenta creada. Revisa tu correo para confirmar.', 'success');
      this.router.navigate(['/auth/login'], { replaceUrl: true });
    } catch (err: any) {
      this.showToast(err?.message ?? 'Error al crear cuenta');
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  private async showToast(message: string, color = 'danger') {
    const t = await this.toast.create({ message, duration: 4000, position: 'bottom', color });
    await t.present();
  }
}
