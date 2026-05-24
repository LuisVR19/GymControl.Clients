import { Component, OnInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private lastBack = 0;

  constructor(
    private platform: Platform,
    private toast: ToastController,
  ) {}

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10, () => this.handleBack());
  }

  private async handleBack() {
    const now = Date.now();
    if (now - this.lastBack < 2000) {
      App.exitApp();
    } else {
      this.lastBack = now;
      const t = await this.toast.create({
        message: 'Presioná de nuevo para salir',
        duration: 2000,
        position: 'bottom',
      });
      await t.present();
    }
  }
}
