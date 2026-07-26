export class SubscriptionCancelledEvent {
  constructor(
    public readonly subscriptionId: number,
    public readonly reason?: string,
  ) {}
}
