import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from './entities/post.entity'
import { Category } from './entities/category.entity'
import { Tag } from './entities/tag.entity'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { AdminPostsController, AdminCategoriesController } from './admin-posts.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category, Tag])],
  providers: [PostsService],
  controllers: [PostsController, AdminPostsController, AdminCategoriesController],
})
export class PostsModule {}
