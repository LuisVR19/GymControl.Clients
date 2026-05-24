import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { GymInfo } from '../../../core/models';

@Component({
  selector: 'app-gym-badge',
  standalone: false,
  template: `
    <div [style]="containerStyle">
      <img *ngIf="gym?.logo_url" [src]="gym!.logo_url!" [style]="imgStyle" [alt]="gym!.name" />
      <span *ngIf="!gym?.logo_url && gym" [style]="initialsStyle">{{ initials }}</span>
    </div>
  `,
})
export class GymBadgeComponent implements OnInit, OnChanges, OnDestroy {
  @Input() size = 40;

  gym: GymInfo | null = null;
  initials = '';
  containerStyle: Record<string, string> = {};
  imgStyle: Record<string, string> = {};
  initialsStyle: Record<string, string> = {};

  private sub!: Subscription;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.sub = this.auth.gym$.subscribe(g => {
      this.gym = g;
      this.initials = g ? g.name.trim().charAt(0).toUpperCase() : '';
      this.updateStyles();
    });
  }

  ngOnChanges() {
    this.updateStyles();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private updateStyles() {
    const hasLogo = !!this.gym?.logo_url;
    this.containerStyle = {
      width:           `${this.size}px`,
      height:          `${this.size}px`,
      borderRadius:    `${this.size}px`,
      background:      hasLogo ? 'var(--bg-elev)' : '#1a1a1a',
      border:          '1px solid var(--line-2)',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      overflow:        'hidden',
      flexShrink:      '0',
    };
    this.imgStyle = {
      width:        '100%',
      height:       '100%',
      objectFit:    'cover',
      display:      'block',
      borderRadius: `${this.size}px`,
    };
    this.initialsStyle = {
      fontFamily:  'var(--font-display)',
      fontWeight:  '700',
      fontSize:    `${Math.floor(this.size * 0.42)}px`,
      color:       '#fff',
      lineHeight:  '1',
    };
  }
}
