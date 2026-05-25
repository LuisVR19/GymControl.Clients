import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabase.client';
import { GymInfo, Profile } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject    = new BehaviorSubject<User | null>(null);
  private profileSubject = new BehaviorSubject<Profile | null>(null);
  private gymSubject     = new BehaviorSubject<GymInfo | null>(null);

  user$    = this.userSubject.asObservable();
  profile$ = this.profileSubject.asObservable();
  gym$     = this.gymSubject.asObservable();

  constructor(private router: Router) {
    this.init();
  }

  private async init() {
    const { data: { session } } = await supabase.auth.getSession();
    this.userSubject.next(session?.user ?? null);
    if (session?.user) await this.loadProfile(session.user.id);

    supabase.auth.onAuthStateChange((_, session) => {
      this.userSubject.next(session?.user ?? null);
      if (session?.user) {
        const userId = session.user.id;
        queueMicrotask(() => { this.loadProfile(userId); });
      } else {
        this.profileSubject.next(null);
        this.gymSubject.next(null);
      }
    });
  }

  private async loadProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    this.profileSubject.next(data as Profile | null);
    if ((data as any)?.gym_id) {
      const { data: gym } = await supabase
        .from('gyms')
        .select('id, name, logo_url, address, phone, whatsapp, website, instagram, about')
        .eq('id', (data as any).gym_id)
        .single();
      this.gymSubject.next(gym as GymInfo | null);
    } else {
      this.gymSubject.next(null);
    }
  }

  get currentGym(): GymInfo | null {
    return this.gymSubject.value;
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get currentProfile(): Profile | null {
    return this.profileSubject.value;
  }

  async reloadProfile(): Promise<void> {
    const user = this.currentUser;
    if (user) await this.loadProfile(user.id);
  }

  async login(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async register(email: string, password: string, cedula: string): Promise<void> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      const { error: rpcError } = await supabase.rpc('link_or_create_profile', {
        p_cedula:       cedula,
        p_auth_user_id: data.user.id,
        p_email:        email,
      });
      if (rpcError) throw rpcError;
    }
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  }
}
