import { execSync } from 'node:child_process'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456',
      })
      .expect(201)
  })

  it('should be able to log in an existing user', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456',
      })
      .expect(201)

    expect(createUserResponse).toHaveProperty('text')

    const createUserResponseText = createUserResponse.text.split(': ')
    const userId = createUserResponseText[1]

    // Assert the userId is a valid UUID
    expect(userId).toMatch(/^[a-f0-9-]{36}$/)

    const loginResponse = await request(app.server)
      .post('/users/login')
      .send({
        email: 'johndoe@gmail.com',
        password: '123456',
      })
      .expect(200)

    expect(loginResponse.body).toHaveProperty('sessionId')
  })
})
