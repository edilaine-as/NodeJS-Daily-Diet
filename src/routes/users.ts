import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'
import { comparePasswordHash } from '../utils/compare-password-hash'
import { returnPasswordHash } from '../utils/return-password-hash'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    })

    try {
      const { name, email, password } = createUserBodySchema.parse(request.body)

      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = randomUUID()

        reply.setCookie('sessionId', sessionId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
      }

      const userEmail = await knex('users').where('email', email).first()

      if (userEmail) {
        return reply.status(400).send({ message: 'User already exists' })
      }

      const passwordHash = await returnPasswordHash(password)

      const userId = await knex('users')
        .insert({
          id: randomUUID(),
          session_id: sessionId,
          name: name,
          email: email,
          password: passwordHash,
        })
        .returning('id')

      return reply.status(201).send(`userId: ${userId[0].id}`)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply
          .status(400)
          .send({ error: 'Invalid parameters', issues: error.errors })
      }

      return reply
        .status(500)
        .send({ error: `An error occurred while inserting the user: ${error}` })
    }
  })

  app.post('/login', async (request, reply) => {
    const loginBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    try {
      const { email, password } = loginBodySchema.parse(request.body)

      // Verifica se o usuário existe
      const user = await knex('users').where('email', email).first()

      if (!user) {
        return reply.status(400).send({ message: 'User not found' })
      }

      const isPasswordCorrect = await comparePasswordHash(
        password,
        user.password
      )

      if (!isPasswordCorrect) {
        return reply.status(400).send({ message: 'Invalid credentials' })
      }

      // Gera um sessionId se não houver
      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = randomUUID()

        reply.setCookie('sessionId', sessionId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 dias
        })

        await knex('users')
          .where('id', user.id)
          .update({ session_id: sessionId })
      }

      // Resposta de sucesso
      return reply.status(200).send({ message: 'Login successful', sessionId })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply
          .status(400)
          .send({ error: 'Invalid parameters', issues: error.errors })
      }

      return reply.status(500).send({ error: 'An error occurred during login' })
    }
  })
}
