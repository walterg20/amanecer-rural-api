export class SubscriptionRenewedEvent {
  constructor(
    public readonly subscriptionId: number,
    public readonly transactionId?: number,
    public readonly newPeriodEnd?: Date,
  ) {}
}
