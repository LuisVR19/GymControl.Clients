import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: false,
  template: `
    <img *ngIf="avatarUrl" [src]="avatarUrl" [style]="imgStyle" alt="avatar" />
    <div *ngIf="!avatarUrl" [style]="style">{{ initials }}</div>
  `
})
export class AvatarComponent implements OnChanges {
  @Input() name = '??';
  @Input() size = 36;
  @Input() dark = false;
  @Input() avatarUrl: string | null = null;

  initials = '';
  style: Record<string, string> = {};
  imgStyle: Record<string, string> = {};

  ngOnChanges() {
    this.initials = this.name.split(' ')
      .map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const hue = (this.name.charCodeAt(0) * 7) % 360;
    const l = this.dark ? 0.32 : 0.92;
    const base: Record<string, string> = {
      width: `${this.size}px`,
      height: `${this.size}px`,
      borderRadius: `${this.size}px`,
      flexShrink: '0',
    };
    this.style = {
      ...base,
      background: `oklch(${l} 0.04 ${hue})`,
      color: this.dark ? '#F5F4EE' : '#0E0E0C',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: '600',
      fontSize: `${Math.floor(this.size * 0.38)}px`,
    };
    this.imgStyle = {
      ...base,
      objectFit: 'cover',
      display: 'block',
    };
  }
}
