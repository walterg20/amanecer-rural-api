import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

describe('Auth (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix('api/v1')
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    await app.init()
  }, 30000)

  afterAll(async () => {
    await app.close()
  })

  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'Test1234!',
    name: 'Test User',
  }

  let accessToken: string

  it('POST /api/v1/auth/register creates user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(testUser)
      .expect(201)

    expect(res.body).toHaveProperty('accessToken')
    expect(res.body).toHaveProperty('refreshToken')
    expect(res.body.user).toMatchObject({
      email: testUser.email,
      name: testUser.name,
    })
    accessToken = res.body.accessToken
  })

  it('POST /api/v1/auth/register rejects duplicate email', async () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(testUser)
      .expect(409)
  })

  it('POST /api/v1/auth/login returns tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(201)

    expect(res.body).toHaveProperty('accessToken')
    expect(res.body).toHaveProperty('refreshToken')
  })

  it('POST /api/v1/auth/login rejects wrong password', async () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: 'wrongpass' })
      .expect(401)
  })

  it('GET /api/v1/auth/me returns profile with valid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)

    expect(res.body).toMatchObject({
      email: testUser.email,
      name: testUser.name,
    })
  })

  it('GET /api/v1/auth/me rejects without token', async () => {
    return request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .expect(401)
  })
})
