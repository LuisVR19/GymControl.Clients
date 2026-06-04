import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import { Payment } from '../../../core/models';

@Component({
  selector: 'app-payment-history',
  standalone: false,
  templateUrl: './payment-history.page.html',
  styleUrls: ['./payment-history.page.scss'],
})
export class PaymentHistoryPage implements OnInit {
  allPayments:  Payment[] = [];
  loading = true;

  get pendingPayments(): Payment[] {
    return this.allPayments.filter(p => p.status === 'pending');
  }

  get payments(): Payment[] {
    return this.allPayments.filter(p => p.status !== 'pending');
  }

  get totalFormatted(): string {
    const total = this.payments.reduce((s, p) => s + p.rawAmount, 0);
    return total.toLocaleString('es-CR');
  }

  constructor(
    private payment: PaymentService,
    private router: Router,
  ) {}

  ngOnInit() { this.load(); }

  ionViewWillEnter() { this.load(); }

  async doRefresh(event: Event) {
    await this.load();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async load() {
    this.loading = true;
    try {
      this.allPayments = await this.payment.getPayments();
    } finally {
      this.loading = false;
    }
  }

  goBack()       { this.router.navigate(['/tabs/perfil']); }
  goToRegister() { this.router.navigate(['/tabs/perfil/register-payment']); }
}
