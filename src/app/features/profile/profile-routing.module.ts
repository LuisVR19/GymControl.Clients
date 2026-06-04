import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePage } from './profile.page';
import { PersonalInfoPage } from './personal-info/personal-info.page';
import { AffiliateGymPage } from './affiliate-gym/affiliate-gym.page';
import { PaymentHistoryPage } from './payment-history/payment-history.page';
import { RegisterPaymentPage } from './register-payment/register-payment.page';

const routes: Routes = [
  { path: '', component: ProfilePage },
  { path: 'personal-info', component: PersonalInfoPage },
  { path: 'affiliate-gym', component: AffiliateGymPage },
  { path: 'payment-history', component: PaymentHistoryPage },
  { path: 'register-payment', component: RegisterPaymentPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
