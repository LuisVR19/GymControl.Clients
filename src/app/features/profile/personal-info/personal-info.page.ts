import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { MembershipService } from '../../../core/services/membership.service';
import { supabase } from '../../../core/supabase.client';

interface PersonalData {
  name:  string;
  email: string;
  phone: string;
  avatarUrl: string | null;
}

@Component({
  selector: 'app-personal-info',
  standalone: false,
  templateUrl: './personal-info.page.html',
  styleUrls: ['./personal-info.page.scss'],
})
export class PersonalInfoPage implements OnInit {
  editing         = false;
  saving          = false;
  loading         = true;
  avatarUploading = false;

  data:  PersonalData = this.empty();
  draft: PersonalData = this.empty();

  gymName    = '';
  planName   = '';
  memberSince = '';
  memberId   = '';

  constructor(
    private membership: MembershipService,
    private router:     Router,
    private toast:      ToastController,
  ) {}

  ngOnInit() { this.load(); }

  private async load() {
    this.loading = true;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, plan] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        this.membership.getActiveMembership(),
      ]);

      const p = profileRes.data as any ?? {};

      this.data = {
        name:      p.name       ?? '',
        email:     p.email      ?? user.email ?? '',
        phone:     p.phone      ?? '',
        avatarUrl: p.avatar_url ?? null,
      };
      this.draft = { ...this.data };

      this.planName   = plan?.name ?? '';
      this.memberId   = 'ID · ' + String(p.id ?? '').slice(-8).toUpperCase();
      this.memberSince = p.created_at
        ? new Date(p.created_at).toLocaleDateString('es-CR', { day: 'numeric', month: 'short', year: 'numeric' })
        : '';

      if (p.gym_id) {
        const { data: gym } = await supabase.from('gyms').select('name').eq('id', p.gym_id).single();
        this.gymName = (gym as any)?.name ?? '';
      }
    } catch {
      this.showToast('Error al cargar datos');
    } finally {
      this.loading = false;
    }
  }

  startEdit() {
    this.draft = { ...this.data };
    this.editing = true;
  }

  cancelEdit() {
    this.draft = { ...this.data };
    this.editing = false;
  }

  async saveEdit() {
    this.saving = true;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('profiles').update({
        name:       this.draft.name      || null,
        phone:      this.draft.phone     || null,
        avatar_url: this.draft.avatarUrl || null,
      }).eq('id', user.id);

      if (error) throw error;

      this.data    = { ...this.draft };
      this.editing = false;
      this.showToast('Cambios guardados', 'success');
    } catch {
      this.showToast('Error al guardar');
    } finally {
      this.saving = false;
    }
  }

  async onAvatarFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.avatarUploading = true;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const ext  = file.name.split('.').pop() ?? 'jpg';
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);

      this.draft.avatarUrl = publicUrl + '?t=' + Date.now();
    } catch {
      this.showToast('Error al subir imagen');
    } finally {
      this.avatarUploading = false;
      (event.target as HTMLInputElement).value = '';
    }
  }

  goBack() { this.router.navigate(['/tabs/perfil']); }

  private empty(): PersonalData {
    return { name: '', email: '', phone: '', avatarUrl: null };
  }

  private async showToast(message: string, color: 'danger' | 'success' = 'danger') {
    const t = await this.toast.create({ message, duration: 2500, position: 'bottom', color });
    await t.present();
  }
}
