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
  payments: Payment[] = [];
  loading = true;
  totalFormatted = '0';

  constructor(
    private payment: PaymentService,
    private router: Router,
  ) {}

  ngOnInit() { this.load(); }

  async doRefresh(event: Event) {
    await this.load();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async load() {
    this.loading = true;
    try {
      this.payments = await this.payment.getPayments();
      const total = this.payments.reduce((sum, p) => sum + p.rawAmount, 0);
      this.totalFormatted = total.toLocaleString('es-CR');
    } finally {
      this.loading = false;
    }
  }

  goBack() { this.router.navigate(['/tabs/perfil']); }
}
