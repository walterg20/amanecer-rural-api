export class SubscriptionExpiredEvent {
  constructor(
    public readonly subscriptionId: number,
  ) {}
}
