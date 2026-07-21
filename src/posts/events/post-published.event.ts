export class PostPublishedEvent {
  constructor(
    public readonly entityId: number,
    public readonly userId: number,
    public readonly publishedAt: Date,
  ) {}
}
