import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import * as express from 'express'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const uploadsDir = join(process.cwd(), 'uploads')
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true })

  app.setGlobalPrefix('api/v1')

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')))

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Amanecer Rural')
    .setDescription('API REST del portal agropecuario Amanecer Rural. Proporciona autenticación, gestión de contenido, pagos y más.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document, {
    explorer: true,
    swaggerOptions: { persistAuthorization: true },
  })

  const port = process.env.API_PORT || 3000
  await app.listen(port)
  console.log(`API running on http://localhost:${port}/api/v1`)
  console.log(`Swagger docs at http://localhost:${port}/api/docs`)
}
bootstrap()
