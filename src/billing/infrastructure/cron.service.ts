import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BillingService } from 'src/billing/application/billing.service';
export const CRON_SERVICE = 'CRON_SERVICE';
@Injectable()
export class CronService {
  constructor(private readonly billingService: BillingService) {}

  @Cron('0 0 1 * *')
  async handleCron() {
    console.log('[Billing] Lancement facturation mensuelle...');
    await this.billingService.processMonthlyBilling();
  }
}
