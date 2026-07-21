"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: path.resolve(__dirname, '../.env') });
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5433,
    database: process.env.DB_NAME || 'amanecer_rural',
    username: process.env.DB_USER || 'ar_user',
    password: process.env.DB_PASSWORD || 'ar_password',
    entities: [path.resolve(__dirname, '../dist/**/*.entity.js')],
});
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
async function migrate() {
    const exportPath = process.argv[2] || path.resolve(__dirname, '../data/export.json');
    const raw = fs.readFileSync(exportPath, 'utf-8');
    const posts = JSON.parse(raw);
    console.log(`📄 Found ${posts.length} posts to migrate`);
    await AppDataSource.initialize();
    const queryRunner = AppDataSource.createQueryRunner();
    const stats = { success: 0, skipped: 0, errors: 0, total: posts.length };
    for (const post of posts) {
        try {
            const slug = slugify(post.title);
            const existing = await queryRunner.query('SELECT id FROM posts WHERE slug = $1', [slug]);
            if (existing.length > 0) {
                console.log(`⏭️  Skipping "${post.title}" (slug already exists)`);
                stats.skipped++;
                continue;
            }
            const categoryResult = await queryRunner.query('SELECT id FROM categories WHERE slug = $1', [slugify(post.category)]);
            const categoryId = categoryResult.length > 0 ? categoryResult[0].id : null;
            await queryRunner.query(`INSERT INTO posts (
          title, slug, content, excerpt, type, status,
          category_id, author_id, featured_image,
          published_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11)`, [
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
            ]);
            console.log(`✅ Migrated "${post.title}"`);
            stats.success++;
        }
        catch (error) {
            console.error(`❌ Error migrating "${post.title}":`, error);
            stats.errors++;
        }
    }
    console.log('\n📊 Migration complete:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Success: ${stats.success}`);
    console.log(`   Skipped: ${stats.skipped}`);
    console.log(`   Errors: ${stats.errors}`);
    await queryRunner.release();
    await AppDataSource.destroy();
}
migrate().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
//# sourceMappingURL=migrate-from-php.js.map