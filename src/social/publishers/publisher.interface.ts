export interface PublishResult {
  success: boolean
  postId?: string
  url?: string
  error?: string
}

export interface IPublisher {
  publish(
    pageAccessToken: string,
    pageId: string,
    text: string,
    mediaUrls?: string[],
  ): Promise<PublishResult>
}
