import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Post, PostStatus } from './entities/post.entity'
import { Category } from './entities/category.entity'
import { Tag } from './entities/tag.entity'

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  async findAll(query: { type?: string; category?: string; status?: string; page?: number; limit?: number }) {
    const { type, category, status, page = 1, limit = 10 } = query
    const qb = this.postRepo.createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tags')

    if (type) qb.andWhere('post.type = :type', { type })
    if (category) qb.andWhere('category.slug = :category', { category })
    if (status) qb.andWhere('post.status = :status', { status })
    else qb.andWhere('post.status = :defaultStatus', { defaultStatus: PostStatus.PUBLISHED })

    qb.orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
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

  async createCategory(data: { name: string; description?: string; parentId?: number }): Promise<Category> {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const category = this.categoryRepo.create({ ...data, slug })
    return this.categoryRepo.save(category)
  }

  async findAllCategories() {
    return this.categoryRepo.find({ relations: { children: true } })
  }

  async findAllTags() {
    return this.tagRepo.find()
  }
}
