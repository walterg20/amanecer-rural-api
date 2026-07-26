import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { extname, join } from 'path'
import { randomUUID } from 'crypto'
import { writeFileSync } from 'fs'
import { BadRequestException } from '@nestjs/common'

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const MAGIC_BYTES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]],
}

function validateMagicBytes(buffer: Buffer, mime: string): boolean {
  const signatures = MAGIC_BYTES[mime]
  if (!signatures) return false
  return signatures.some(sig =>
    sig.every((byte, i) => buffer[i] === byte),
  )
}

export const ImageUpload = (fieldName = 'file') =>
  FileInterceptor(fieldName, {
    storage: memoryStorage(),
    fileFilter: (_req, file, cb) => {
      if (!ALLOWED_MIMES.includes(file.mimetype)) {
        cb(new BadRequestException('Only image files are allowed (jpeg, png, gif, webp)'), false)
        return
      }
      cb(null, true)
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  })

export function saveUploadedFile(file: Express.Multer.File): { url: string; filename: string } {
  if (!validateMagicBytes(file.buffer, file.mimetype)) {
    throw new BadRequestException('File content does not match the declared image type')
  }

  const filename = `${randomUUID()}${extname(file.originalname)}`
  writeFileSync(join(process.cwd(), 'uploads', filename), file.buffer)
  return { url: `/uploads/${filename}`, filename }
}
