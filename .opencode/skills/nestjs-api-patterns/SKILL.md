---
name: nestjs-api-patterns
description: NestJS 11 API patterns for Amanecer Rural — modules, controllers, services, DTOs, guards, pipes, Swagger. Use when creating or modifying API endpoints, DTOs, or module structure.
license: MIT
metadata:
  author: Amanecer Rural
  version: "1.0.0"
---

# NestJS API Patterns

## Project conventions

- Global prefix: `/api/v1/` (set in `src/main.ts`)
- Feature modules: `src/<feature>/` with `module`, `controller`, `service`, `entities/`, `dto/`
- Response shape: `{ data, meta, error }`
- `ValidationPipe` global con `whitelist: true`, `transform: true`
- Swagger docs en `/api/docs`

## Module structure

```
src/posts/
├── posts.module.ts        # @Module({ imports, controllers, providers })
├── posts.controller.ts    # @Controller('posts') — endpoints públicos
├── admin-posts.controller.ts  # @Controller('admin/posts') — endpoints admin
├── posts.service.ts       # @Injectable() — lógica de negocio
├── entities/
│   ├── post.entity.ts
│   └── category.entity.ts
└── dto/
    ├── create-post.dto.ts
    └── update-post.dto.ts
```

## Controller patterns

### Público
```typescript
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.postsService.findAll(query)
  }
}
```

### Admin (protegido)
```typescript
@ApiTags('Admin / Posts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/posts')
export class AdminPostsController {
  constructor(private readonly postsService: PostsService) {}

  @Patch(':id')
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar post' })
  async update(@Param('id') id: string, @Body() body: UpdatePostDto) {
    const post = await this.postsService.update(+id, body)
    return { data: post }
  }
}
```

## DTO patterns

### Create
```typescript
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreatePostDto {
  @ApiProperty({ example: 'Título del post' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title!: string
}
```

### Update (PartialType)
```typescript
import { PartialType } from '@nestjs/swagger'
import { CreatePostDto } from './create-post.dto'
export class UpdatePostDto extends PartialType(CreatePostDto) {}
```

## Service patterns

```typescript
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { id } })
    if (!post) throw new NotFoundException('Post not found')
    return post
  }

  async create(data: Partial<Post>): Promise<Post> {
    const slug = data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const post = this.postRepo.create({ ...data, slug })
    return this.postRepo.save(post)
  }

  async update(id: number, data: Partial<Post>): Promise<Post> {
    const updateData = { ...data }
    if (data.title) {
      updateData.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }
    await this.postRepo.update(id, updateData)
    return this.findOne(id)
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.postRepo.softDelete(id)
    if (result.affected === 0) throw new NotFoundException('Post not found')
  }
}
```

## Error handling

- `NotFoundException` para recursos no encontrados
- `BadRequestException` para validaciones de negocio
- El `NotFoundExceptionFilter` global maneja el resto
- El `ValidationPipe` con `whitelist: true` rechaza campos no definidos en el DTO

## Upload pattern

```typescript
@Post('upload')
@UseInterceptors(ImageUpload('image'))
async uploadImage(@UploadedFile() file: Express.Multer.File) {
  if (!file) throw new BadRequestException('La imagen es requerida')
  return { data: { url: `/uploads/${file.filename}`, filename: file.filename } }
}
```

## Pagination pattern

```typescript
async findAllAdmin(query: { page?: number; limit?: number }) {
  const { page, limit } = query
  const p = page ?? 1
  const l = limit ?? 10
  const [data, total] = await this.repo.findAndCount({ skip: (p - 1) * l, take: l })
  return { data, meta: { total, page: p, limit: l, totalPages: Math.ceil(total / l) } }
}
```
