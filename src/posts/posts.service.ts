import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Post, PostStatus } from './entities/post.entity'
import { Category } from './entities/category.entity'
import { Tag } from './entities/tag.entity'
import { PostPublishedEvent } from './events/post-published.event'
import { PostArchivedEvent } from './events/post-archived.event'

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findPublished(query: { type?: string; category?: string; page?: number; limit?: number }) {
    return this.findAll({ ...query, status: 'published' })
  }

  async findAll(query: { type?: string; category?: string; status?: string; page?: number; limit?: number }) {
    const { type, category, status, page = 1, limit = 10 } = query
    const qb = this.postRepo.createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tags')

    if (type) qb.andWhere('post.type = :type', { type })
    if (category) qb.andWhere('category.slug = :category', { category })
    if (status) qb.andWhere('post.status = :status', { status })

    qb.orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: { category: true, author: true, tags: true },
    })
    if (!post) throw new NotFoundException('Post not found')
    return post
  }

  async findBySlug(slug: string): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { slug },
      relations: { category: true, author: true, tags: true },
    })
    if (!post) throw new NotFoundException('Post not found')
    return post
  }

  async create(data: Partial<Post>): Promise<Post> {
    const slug = data.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    const post = this.postRepo.create({ ...data, slug })
    return this.postRepo.save(post)
  }

  async update(id: number, data: Partial<Post>): Promise<Post> {
    const updateData = { ...data }
    if (data.title) {
      updateData.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }
    await this.postRepo.update(id, updateData)
    const updated = await this.postRepo.findOne({ where: { id } })
    if (!updated) throw new NotFoundException('Post not found')
    return updated
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.postRepo.softDelete(id)
    if (result.affected === 0) throw new NotFoundException('Post not found')
  }

  async publish(id: number, userId: number): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { id } })
    if (!post) throw new NotFoundException('Post not found')
    if (post.status !== PostStatus.DRAFT) {
      throw new BadRequestException('Solo se pueden publicar posts en estado draft')
    }

    post.status = PostStatus.PUBLISHED
    post.publishedAt = new Date()
    const saved = await this.postRepo.save(post)

    this.eventEmitter.emit(
      'post.published',
      new PostPublishedEvent(saved.id, userId, saved.publishedAt!),
    )

    return saved
  }

  async archive(id: number, userId: number): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { id } })
    if (!post) throw new NotFoundException('Post not found')
    if (post.status !== PostStatus.PUBLISHED) {
      throw new BadRequestException('Solo se pueden archivar posts publicados')
    }

    post.status = PostStatus.ARCHIVED
    const saved = await this.postRepo.save(post)

    this.eventEmitter.emit(
      'post.archived',
      new PostArchivedEvent(saved.id, userId),
    )

    return saved
  }

  async createCategory(data: { name: string; description?: string; parentId?: number }): Promise<Category> {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const category = this.categoryRepo.create({ ...data, slug })
    return this.categoryRepo.save(category)
  }

  async findCategory(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: { children: true },
    })
    if (!category) throw new NotFoundException('Category not found')
    return category
  }

  async findAllCategories() {
    return this.categoryRepo.find({ relations: { children: true } })
  }

  async findAllCategoriesAdmin(query: { page?: number; limit?: number }) {
    const { page, limit } = query
    const hasPagination = page !== undefined || limit !== undefined

    if (!hasPagination) {
      const data = await this.categoryRepo.find({ relations: { children: true }, order: { name: 'ASC' } })
      return { data }
    }

    const p = page ?? 1
    const l = limit ?? 10
    const qb = this.categoryRepo.createQueryBuilder('cat')
      .leftJoinAndSelect('cat.children', 'children')
      .orderBy('cat.name', 'ASC')
      .skip((p - 1) * l)
      .take(l)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } }
  }

  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    const updateData = { ...data }
    if (data.name) {
      updateData.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }
    await this.categoryRepo.update(id, updateData)
    const updated = await this.categoryRepo.findOne({ where: { id } })
    if (!updated) throw new NotFoundException('Categoría no encontrada')
    return updated
  }

  async deleteCategory(id: number): Promise<void> {
    const result = await this.categoryRepo.delete(id)
    if (result.affected === 0) throw new NotFoundException('Categoría no encontrada')
  }

  async findAllTags() {
    return this.tagRepo.find()
  }
}
