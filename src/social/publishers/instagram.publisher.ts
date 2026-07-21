import { Injectable } from '@nestjs/common'
import { IPublisher, PublishResult } from './publisher.interface'

const GRAPH_API = 'https://graph.facebook.com/v21.0'

@Injectable()
export class InstagramPublisher implements IPublisher {
  async publish(
    pageAccessToken: string,
    igUserId: string,
    text: string,
    mediaUrls?: string[],
  ): Promise<PublishResult> {
    try {
      if (!mediaUrls || mediaUrls.length === 0) {
        return { success: false, error: 'Instagram requiere al menos una imagen o video' }
      }

      const mediaUrl = mediaUrls[0]
      const mediaType = this.inferMediaType(mediaUrl)

      const containerRes = await fetch(`${GRAPH_API}/${igUserId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: mediaType === 'video' ? 'VIDEO' : 'IMAGE',
          media_url: mediaUrl,
          caption: text,
          access_token: pageAccessToken,
        }),
      })
      const containerData = await containerRes.json() as any

      if (!containerRes.ok) {
        return { success: false, error: containerData.error?.message || 'Error al crear container' }
      }

      const creationId = containerData.id

      await this.delay(5000)

      const publishRes = await fetch(`${GRAPH_API}/${igUserId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: pageAccessToken,
        }),
      })
      const publishData = await publishRes.json() as any

      if (!publishRes.ok) {
        return { success: false, error: publishData.error?.message || 'Error al publicar en Instagram' }
      }

      return { success: true, postId: publishData.id, url: `https://instagram.com/p/${publishData.id}` }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  private inferMediaType(url: string): 'image' | 'video' {
    const ext = url.split('?')[0].toLowerCase()
    if (ext.endsWith('.mp4') || ext.endsWith('.mov') || ext.endsWith('.avi')) return 'video'
    return 'image'
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
