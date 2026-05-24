import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-sparkline',
  standalone: false,
  template: `
    <svg [attr.width]="width || '100%'" [attr.height]="height"
         [attr.viewBox]="'0 0 ' + vw + ' ' + height"
         style="display:block; overflow:visible">
      <path *ngIf="fill && fillPath"
            [attr.d]="fillPath"
            [attr.fill]="color"
            fill-opacity="0.12"/>
      <path *ngIf="linePath"
            [attr.d]="linePath"
            [attr.stroke]="color"
            stroke-width="1.5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"/>
    </svg>
  `
})
export class SparklineComponent implements OnChanges {
  @Input() data: number[] = [];
  @Input() width: number | null = null;
  @Input() height = 36;
  @Input() color = 'currentColor';
  @Input() fill = false;

  vw = 300;
  linePath = '';
  fillPath = '';

  ngOnChanges() {
    this.vw = this.width || 300;
    this.computePaths();
  }

  private computePaths() {
    if (!this.data.length) return;

    const mid = this.height / 2;
    if (this.data.length === 1) {
      this.linePath = `M0,${mid} L${this.vw},${mid}`;
      this.fillPath = `M0,${mid} L${this.vw},${mid} L${this.vw},${this.height} L0,${this.height} Z`;
      return;
    }

    const min = Math.min(...this.data);
    const max = Math.max(...this.data);
    const range = max - min || 1;
    const pts = this.data.map((v, i) => [
      (i / (this.data.length - 1)) * this.vw,
      this.height - ((v - min) / range) * (this.height - 4) - 2
    ]);
    this.linePath = pts.map((p, i) =>
      `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`
    ).join(' ');
    this.fillPath = this.linePath +
      ` L${this.vw},${this.height} L0,${this.height} Z`;
  }
}
