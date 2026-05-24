import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { Exercise } from '../../../core/models';

@Component({
  selector: 'app-exercise-detail-modal',
  standalone: false,
  templateUrl: './exercise-detail-modal.component.html',
  styleUrls: ['./exercise-detail-modal.component.scss'],
})
export class ExerciseDetailModalComponent implements OnInit {
  @Input() exercise!: Exercise;

  isYoutube = false;
  embedUrl: SafeResourceUrl | null = null;

  constructor(
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    if (this.exercise.videoUrl) {
      const url = this.exercise.videoUrl;
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        this.isYoutube = true;
        this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.toEmbedUrl(url));
      }
    }
  }

  private toEmbedUrl(url: string): string {
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split(/[?&]/)[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtube.com/watch')) {
      const match = url.match(/[?&]v=([^&]+)/);
      const id = match ? match[1] : '';
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  }

  dismiss() { this.modalCtrl.dismiss(); }
}
