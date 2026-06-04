import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { PersonalInfoPage } from './personal-info/personal-info.page';
import { AffiliateGymPage } from './affiliate-gym/affiliate-gym.page';
import { PaymentHistoryPage } from './payment-history/payment-history.page';
import { RegisterPaymentPage } from './register-payment/register-payment.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ProfilePageRoutingModule, SharedModule],
  declarations: [ProfilePage, PersonalInfoPage, AffiliateGymPage, PaymentHistoryPage, RegisterPaymentPage],
})
export class ProfilePageModule {}
