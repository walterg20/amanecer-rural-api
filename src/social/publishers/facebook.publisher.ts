import { Injectable } from '@nestjs/common'
import { IPublisher, PublishResult } from './publisher.interface'

const GRAPH_API = 'https://graph.facebook.com/v21.0'

@Injectable()
export class FacebookPublisher implements IPublisher {
  async publish(
    pageAccessToken: string,
    pageId: string,
    text: string,
    mediaUrls?: string[],
  ): Promise<PublishResult> {
    try {
      if (mediaUrls && mediaUrls.length > 0) {
        return this.postWithPhotos(pageAccessToken, pageId, text, mediaUrls)
      }

      const res = await fetch(`${GRAPH_API}/${pageId}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, access_token: pageAccessToken }),
      })
      const data = await res.json() as any

      if (!res.ok) {
        return { success: false, error: data.error?.message || 'Error al publicar en Facebook' }
      }

      return { success: true, postId: data.id, url: `https://facebook.com/${data.id}` }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  private async postWithPhotos(
    pageAccessToken: string,
    pageId: string,
    text: string,
    mediaUrls: string[],
  ): Promise<PublishResult> {
    try {
      const photoIds: string[] = []

      for (const url of mediaUrls) {
        const res = await fetch(`${GRAPH_API}/${pageId}/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url,
            published: false,
            access_token: pageAccessToken,
            message: text,
          }),
        })
        const data = await res.json() as any
        if (!res.ok) {
          return { success: false, error: data.error?.message || 'Error al subir foto' }
        }
        photoIds.push(data.id)
      }

      const attachedMedia = photoIds.map(id => ({ media_fbid: id }))

      const res = await fetch(`${GRAPH_API}/${pageId}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          attached_media: attachedMedia,
          access_token: pageAccessToken,
        }),
      })
      const data = await res.json() as any

      if (!res.ok) {
        return { success: false, error: data.error?.message || 'Error al crear post con fotos' }
      }

      return { success: true, postId: data.id, url: `https://facebook.com/${data.id}` }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
