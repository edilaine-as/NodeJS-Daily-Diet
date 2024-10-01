import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    try {
      const { name, email } = createUserBodySchema.parse(request.body)

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

      const userId = await knex('users')
        .insert({
          id: randomUUID(),
          session_id: sessionId,
          name: name,
          email: email,
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
        .send({ error: 'An error occurred while inserting the user' })
    }
  })
}
