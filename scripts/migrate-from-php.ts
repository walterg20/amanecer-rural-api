import 'reflect-metadata'
import { DataSource } from 'typeorm'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

config({ path: path.resolve(__dirname, '../.env') })

interface PhpPost {
  title: string
  content: string
  excerpt?: string
  category: string
  type: 'news' | 'tech_note' | 'magazine'
  status: 'draft' | 'published' | 'archived'
  created_at: string
  published_at?: string
  featured_image?: string
}

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5433,
  database: process.env.DB_NAME || 'amanecer_rural',
  username: process.env.DB_USER || 'ar_user',
  password: process.env.DB_PASSWORD || 'ar_password',
  entities: [path.resolve(__dirname, '../src/**/*.entity.ts')],
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function migrate() {
  const exportPath = process.argv[2] || path.resolve(__dirname, '../data/export.json')
  const raw = fs.readFileSync(exportPath, 'utf-8')
  const posts: PhpPost[] = JSON.parse(raw)

  console.log(`📄 Found ${posts.length} posts to migrate`)

  await AppDataSource.initialize()
  const queryRunner = AppDataSource.createQueryRunner()

  const stats = { success: 0, skipped: 0, errors: 0, total: posts.length }

  for (const post of posts) {
    try {
      const slug = slugify(post.title)

      const existing = await queryRunner.query(
        'SELECT id FROM posts WHERE slug = $1',
        [slug],
      )

      if (existing.length > 0) {
        console.log(`⏭️  Skipping "${post.title}" (slug already exists)`)
        stats.skipped++
        continue
      }

      const categoryResult = await queryRunner.query(
        'SELECT id FROM categories WHERE slug = $1',
        [slugify(post.category)],
      )
      const categoryId = categoryResult.length > 0 ? categoryResult[0].id : null

      await queryRunner.query(
        `INSERT INTO posts (
          title, slug, content, excerpt, type, status,
          category_id, author_id, featured_image,
          published_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11)`,
        [
          post.title,
          slug,
          post.content,
          post.excerpt || null,
          post.type,
          post.status,
          categoryId,
          1,
          post.featured_image || null,
          post.published_at || null,
          post.created_at,
        ],
      )

      console.log(`✅ Migrated "${post.title}"`)
      stats.success++
    } catch (error) {
      console.error(`❌ Error migrating "${post.title}":`, error)
      stats.errors++
    }
  }

  console.log('\n📊 Migration complete:')
  console.log(`   Total: ${stats.total}`)
  console.log(`   Success: ${stats.success}`)
  console.log(`   Skipped: ${stats.skipped}`)
  console.log(`   Errors: ${stats.errors}`)

  await queryRunner.release()
  await AppDataSource.destroy()
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
