import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { randomUUID } from 'crypto'

export const ImageUpload = (fieldName = 'file') =>
  FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads'),
      filename: (_req, file, cb) => {
        const name = randomUUID()
        const ext = extname(file.originalname)
        cb(null, `${name}${ext}`)
      },
    }),
    fileFilter: (_req, file, cb) => {
      const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowed.includes(file.mimetype)) {
        cb(new Error('Only image files are allowed (jpeg, png, gif, webp)'), false)
        return
      }
      cb(null, true)
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  })
