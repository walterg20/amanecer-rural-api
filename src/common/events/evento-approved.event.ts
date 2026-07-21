export class EventoApprovedEvent {
  constructor(
    public readonly entityId: number,
    public readonly userId: number,
  ) {}
}
