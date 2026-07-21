export class RemateCancelledEvent {
  constructor(
    public readonly entityId: number,
    public readonly userId: number,
  ) {}
}
