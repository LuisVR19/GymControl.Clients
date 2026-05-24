import { Component, Input, OnChanges } from '@angular/core';

interface Bar {
  x: number; y: number; w: number; h: number;
  lx: number; label: string; last: boolean;
}

@Component({
  selector: 'app-bar-chart',
  standalone: false,
  template: `
    <svg [attr.width]="width || '100%'" [attr.height]="height"
         [attr.viewBox]="'0 0 ' + vw + ' ' + height"
         style="display:block">
      <g *ngFor="let bar of bars">
        <rect [attr.x]="bar.x" [attr.y]="bar.y"
              [attr.width]="bar.w" [attr.height]="bar.h"
              rx="3"
              [attr.fill]="color"
              [attr.opacity]="bar.last ? 1 : 0.45"/>
        <text [attr.x]="bar.lx" [attr.y]="height - 4"
              text-anchor="middle"
              font-family="var(--font-mono)"
              font-size="9"
              fill="var(--ink-3)">{{ bar.label }}</text>
      </g>
    </svg>
  `
})
export class BarChartComponent implements OnChanges {
  @Input() data: number[] = [];
  @Input() labels: string[] = [];
  @Input() width: number | null = null;
  @Input() height = 140;
  @Input() color = 'var(--ink)';

  vw = 300;
  bars: Bar[] = [];

  ngOnChanges() {
    this.vw = this.width || 300;
    this.computeBars();
  }

  private computeBars() {
    if (!this.data.length) return;
    const max = Math.max(...this.data) || 1;
    const bw = this.vw / this.data.length;
    const pad = 4;
    this.bars = this.data.map((v, i) => {
      const h = (v / max) * (this.height - 24);
      return {
        x: i * bw + pad,
        y: this.height - h - 18,
        w: bw - pad * 2,
        h,
        lx: i * bw + bw / 2,
        label: this.labels[i] || '',
        last: i === this.data.length - 1
      };
    });
  }
}
