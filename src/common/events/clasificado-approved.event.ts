export class ClasificadoApprovedEvent {
  constructor(
    public readonly entityId: number,
    public readonly userId: number,
  ) {}
}
