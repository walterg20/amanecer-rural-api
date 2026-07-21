import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SocialAccount, SocialPlatform } from './entities/social-account.entity'
import { FacebookPublisher } from './publishers/facebook.publisher'
import { InstagramPublisher } from './publishers/instagram.publisher'

const GRAPH_API = 'https://graph.facebook.com/v21.0'

@Injectable()
export class SocialAccountsService {
  constructor(
    @InjectRepository(SocialAccount)
    private readonly repo: Repository<SocialAccount>,
    private readonly facebookPublisher: FacebookPublisher,
    private readonly instagramPublisher: InstagramPublisher,
  ) {}

  async create(data: Partial<SocialAccount>, userId: number): Promise<SocialAccount> {
    const isValid = await this.validateToken(data.pageAccessToken!, data.pageId!)
    if (!isValid) {
      throw new BadRequestException('El token de acceso no es válido para esta página')
    }

    let instagramBusinessId: string | undefined

    if (data.platform === SocialPlatform.INSTAGRAM) {
      instagramBusinessId = await this.resolveInstagramBusinessId(data.pageAccessToken!, data.pageId!)
    }

    const account = this.repo.create({
      ...data,
      instagramBusinessId,
      createdBy: userId,
    })

    return this.repo.save(account)
  }

  async findAll(): Promise<SocialAccount[]> {
    return this.repo.find({ where: { isActive: true }, order: { createdAt: 'DESC' } })
  }

  async update(id: number, data: Partial<SocialAccount>): Promise<SocialAccount> {
    const account = await this.repo.findOne({ where: { id } })
    if (!account) throw new NotFoundException('Cuenta social no encontrada')

    if (data.pageAccessToken && data.pageId) {
      const isValid = await this.validateToken(data.pageAccessToken, data.pageId)
      if (!isValid) {
        throw new BadRequestException('El token de acceso no es válido para esta página')
      }
    }

    if (data.pageAccessToken && account.platform === SocialPlatform.INSTAGRAM) {
      const pageId = data.pageId || account.pageId
      data.instagramBusinessId = await this.resolveInstagramBusinessId(data.pageAccessToken, pageId)
    }

    await this.repo.update(id, data)
    const updated = await this.repo.findOne({ where: { id } })
    if (!updated) throw new NotFoundException('Cuenta social no encontrada')
    return updated
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.softDelete(id)
    if (result.affected === 0) throw new NotFoundException('Cuenta social no encontrada')
  }

  async testPublish(id: number): Promise<{ message: string }> {
    const account = await this.repo.findOne({ where: { id, isActive: true } })
    if (!account) throw new NotFoundException('Cuenta social no encontrada o inactiva')

    const testText = `Post de prueba - ${new Date().toISOString()}`

    if (account.platform === SocialPlatform.FACEBOOK) {
      const result = await this.facebookPublisher.publish(
        account.pageAccessToken,
        account.pageId,
        testText,
      )
      if (!result.success) {
        throw new BadRequestException(`Error al publicar: ${result.error}`)
      }
      return { message: `Publicado en Facebook: ${result.url}` }
    }

    if (account.platform === SocialPlatform.INSTAGRAM) {
      if (!account.instagramBusinessId) {
        throw new BadRequestException('Esta cuenta no tiene Instagram Business ID vinculado')
      }
      const result = await this.instagramPublisher.publish(
        account.pageAccessToken,
        account.instagramBusinessId,
        testText,
      )
      if (!result.success) {
        throw new BadRequestException(`Error al publicar: ${result.error}`)
      }
      return { message: `Publicado en Instagram: ${result.url}` }
    }

    throw new BadRequestException('Plataforma no soportada')
  }

  private async validateToken(accessToken: string, pageId: string): Promise<boolean> {
    try {
      const res = await fetch(`${GRAPH_API}/me/accounts?access_token=${accessToken}`)
      const data = await res.json() as any

      if (!res.ok || !data.data) return false

      return data.data.some((p: any) => p.id === pageId)
    } catch {
      return false
    }
  }

  private async resolveInstagramBusinessId(accessToken: string, pageId: string): Promise<string | undefined> {
    try {
      const res = await fetch(
        `${GRAPH_API}/${pageId}?fields=instagram_business_account&access_token=${accessToken}`,
      )
      const data = await res.json() as any

      return data.instagram_business_account?.id
    } catch {
      return undefined
    }
  }
}
