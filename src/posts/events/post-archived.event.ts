export class PostArchivedEvent {
  constructor(
    public readonly entityId: number,
    public readonly userId: number,
  ) {}
}
