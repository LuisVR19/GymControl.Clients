import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { supabase } from '../../../core/supabase.client';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
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
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) this.router.navigate(['/tabs/inicio'], { replaceUrl: true });
    });
  }

  async login() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    try {
      await this.auth.login(this.form.value.email, this.form.value.password);
      this.router.navigate(['/tabs/inicio'], { replaceUrl: true });
    } catch (err: any) {
      this.showToast(err?.message ?? 'Error al iniciar sesión');
    } finally {
      this.loading = false;
    }
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }

  private async showToast(message: string) {
    const t = await this.toast.create({ message, duration: 3000, position: 'bottom', color: 'danger' });
    await t.present();
  }
}
