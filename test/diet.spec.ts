import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Diet routes', () => {
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

  it.skip('should be able to create a new diet', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookie = userResponse.get('Set-Cookie')

    if (cookie) {
      await request(app.server)
        .post('/diet')
        .set('Cookie', cookie)
        .send({
          name: 'Breakfast',
          description: "It's a breakfast",
          isOnDiet: true,
          date: new Date(),
        })
        .expect(201)
    }
  })

  it('should be able to list the diets from user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookie = userResponse.get('Set-Cookie')

    if (cookie) {
      await request(app.server)
        .post('/diet')
        .set('Cookie', cookie)
        .send({
          name: 'Breakfast',
          description: "It's a breakfast",
          isOnDiet: true,
          date: new Date(),
        })
        .expect(201)

      await request(app.server).get('/diet').set('Cookie', cookie).expect(200)
    }
  })

  it.skip('should be able to list specific diet from user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookie = userResponse.get('Set-Cookie')

    if (cookie) {
      await request(app.server)
        .post('/diet')
        .set('Cookie', cookie)
        .send({
          name: 'Breakfast',
          description: "It's a breakfast",
          isOnDiet: true,
          date: new Date(),
        })
        .expect(201)

      const dietResponse = await request(app.server)
        .get('/diet')
        .set('Cookie', cookie)
        .expect(200)

      const dietId = dietResponse.body.diet[0].id

      await request(app.server)
        .get(`/diet/${dietId}`)
        .set('Cookie', cookie)
        .expect(200)
    }
  })

  it.skip('should be able to update the diet', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookie = userResponse.get('Set-Cookie')

    if (cookie) {
      await request(app.server)
        .post('/diet')
        .set('Cookie', cookie)
        .send({
          name: 'Breakfast',
          description: "It's a breakfast",
          isOnDiet: true,
          date: new Date(),
        })
        .expect(201)

      const dietResponse = await request(app.server)
        .get('/diet')
        .set('Cookie', cookie)
        .expect(200)

      const dietId = dietResponse.body.diet[0].id

      await request(app.server)
        .put(`/diet/${dietId}`)
        .set('Cookie', cookie)
        .send({
          name: 'Dinner',
          description: 'Hamburguer',
          isOnDiet: false,
          date: new Date(),
        })
        .expect(200)
    }
  })

  it.skip('should be able to delete the diet', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookie = userResponse.get('Set-Cookie')

    if (cookie) {
      await request(app.server)
        .post('/diet')
        .set('Cookie', cookie)
        .send({
          name: 'Breakfast',
          description: "It's a breakfast",
          isOnDiet: true,
          date: new Date(),
        })
        .expect(201)

      const dietResponse = await request(app.server)
        .get('/diet')
        .set('Cookie', cookie)
        .expect(200)

      const dietId = dietResponse.body.diet[0].id

      await request(app.server)
        .delete(`/diet/${dietId}`)
        .set('Cookie', cookie)
        .expect(204)
    }
  })
})
