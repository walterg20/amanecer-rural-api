export class SubscriptionActivatedEvent {
  constructor(
    public readonly subscriptionId: number,
    public readonly transactionId?: number,
  ) {}
}
