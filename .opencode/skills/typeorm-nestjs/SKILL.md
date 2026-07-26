---
name: typeorm-nestjs
description: TypeORM 1.x with NestJS 11 at Amanecer Rural — entities, relations, repositories, queries, migrations. Use when creating or modifying database entities, writing queries, or generating migrations.
license: MIT
metadata:
  author: Amanecer Rural
  version: "1.0.0"
---

# TypeORM with NestJS

## Entity patterns

### Basic entity
```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm'

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 255 })
  name!: string

  @Column({ unique: true, length: 255 })
  slug!: string

  @Column({ nullable: true })
  description?: string
}
```

### With relations
```typescript
import { Entity, ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable } from 'typeorm'

// ManyToOne (child -> parent)
@ManyToOne(() => Category, category => category.children)
@JoinColumn({ name: 'parent_id' })
parent?: Category

// OneToMany (parent -> children)
@OneToMany(() => Category, category => category.parent)
children?: Category[]

// ManyToMany
@ManyToMany(() => Tag)
@JoinTable({
  name: 'posts_tags',
  joinColumn: { name: 'post_id', referencedColumnName: 'id' },
  inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
})
tags?: Tag[]
```

### With enums
```typescript
export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('posts')
export class Post {
  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status!: PostStatus
}
```

## Repository injection

```typescript
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}
```

## Query patterns

### Basic find
```typescript
await this.postRepo.findOne({ where: { id }, relations: { category: true, author: true } })
await this.postRepo.find({ relations: { children: true }, order: { name: 'ASC' } })
```

### QueryBuilder
```typescript
const qb = this.postRepo.createQueryBuilder('post')
  .leftJoinAndSelect('post.category', 'category')
  .leftJoinAndSelect('post.author', 'author')
  .where('post.type = :type', { type })
  .andWhere('post.status = :status', { status: PostStatus.PUBLISHED })
  .orderBy('post.createdAt', 'DESC')
  .skip((page - 1) * limit)
  .take(limit)

const [data, total] = await qb.getManyAndCount()
```

### Paginated response
```typescript
return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
```

### Save vs Create
```typescript
// create() prepara el objeto, save() lo persiste
const category = this.categoryRepo.create({ ...data, slug })
return this.categoryRepo.save(category)

// Para updates, usar update() + findOne()
await this.categoryRepo.update(id, updateData)
return this.categoryRepo.findOne({ where: { id } })
```

### Soft delete
```typescript
// Requiere @DeleteDateColumn() en la entidad
await this.postRepo.softDelete(id)
// Para incluir eliminados en queries:
const qb = this.postRepo.createQueryBuilder('post').withDeleted()
```

## Migrations

```bash
npm run typeorm:generate -- --name MigrationName
npm run typeorm:run
npm run typeorm:revert
```

- Las migraciones se generan en `src/migrations/`
- `npm run typeorm:generate` compara entidades con la BD actual
- `npm run migrate:php` para migrar datos desde PHP legacy

## DB config

- PostgreSQL 16 en localhost:5433 (mapped del container)
- `synchronize: true` en development (deshabilitar en producción)
- Snake case en columnas: `created_at`, `parent_id`, `category_id`
