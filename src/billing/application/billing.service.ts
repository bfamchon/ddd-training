import { Billing } from 'src/billing/domain/Billing';
import { BillingLine } from 'src/billing/domain/BillingLine';
import { ZoneNotFoundError } from 'src/billing/domain/errors/zone-not-found.error';
import { BillingRepository } from 'src/billing/infrastructure/billing-repository.port';
import { BillingZoneRepository } from 'src/billing/infrastructure/billing-zone-repository.port';
import { CustomerRepository } from 'src/billing/infrastructure/customer-repository.port';
import { EmailService } from 'src/billing/infrastructure/email-service.port';
import { Duration } from 'src/shared/Duration';
import { UniqueEntityID } from 'src/shared/unique-entity-id';

export const I_BILLING_SERVICE = 'I_BILLING_SERVICE';

export class BillingService {
  constructor(
    private readonly billingZoneRepository: BillingZoneRepository,
    private readonly billingRepository: BillingRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly emailService: EmailService,
  ) {}

  async addBillingLine({
    driverId,
    zoneId,
    sessionDuration,
  }: {
    driverId: string;
    zoneId: string;
    sessionDuration: number;
  }) {
    let billing = await this.billingRepository.findByCustomerId(
      new UniqueEntityID(driverId),
    );
    if (!billing) {
      billing = Billing.create({
        id: new UniqueEntityID(),
        customerId: new UniqueEntityID(driverId),
        billingLines: [],
      });
    }
    const zone = await this.billingZoneRepository.findById(
      new UniqueEntityID(zoneId),
    );
    if (!zone) {
      throw new ZoneNotFoundError(zoneId);
    }
    const parkingCost = zone.calculateParkingCost(
      Duration.fromMilliseconds(sessionDuration),
    );
    const billingLine = BillingLine.create({
      id: new UniqueEntityID(),
      date: new Date(),
      amount: parkingCost,
      zone: zone,
    });
    billing.addBillingLine(billingLine);
    // then persist billing
    await this.billingRepository.create(billing);
  }

  async processMonthlyBilling() {
    // retrieve billings of the month
    const billings = await this.billingRepository.findAllBetween({
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    });
    // retrieve customers based on billing's customerId from customerRepository
    const customersIds = billings.map((billing) => billing.props.customerId);
    const customers = await this.customerRepository.findByIds(customersIds);
    // send billings to customers using an email service
    const emailsPromises = customers.map((customer) => {
      const billing = billings.find((billing) =>
        billing.props.customerId.equals(customer.props.id),
      );
      if (billing) {
        const total = billing.calculateTotal();
        return this.emailService.sendEmail({
          to: customer.props.email,
          subject: 'Your monthly billing',
          body: `Your monthly billing is ${total.amount} ${total.currency}`,
        });
      }
    });
    const emailsPromisesResult = await Promise.allSettled(emailsPromises);
    const failedEmails = emailsPromisesResult.filter(
      (result) => result.status === 'rejected',
    );
    if (failedEmails.length > 0) {
      console.error(
        `Failed to send ${failedEmails.length} emails: ${failedEmails
          .map((result) => result.reason as string)
          .join(', ')}`,
      );
    }
  }
}
