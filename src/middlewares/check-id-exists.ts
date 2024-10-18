import type { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const sessionId = request.cookies.sessionId

  console.log('sessionId:', sessionId)

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized. No sessionId found in cookies.',
    })
  }

  const user = await knex('users')
    .select('*')
    .where('session_id', sessionId)
    .first()

  if (!user) {
    return reply.status(401).send({
      error: 'Unauthorized. Invalid sessionId.',
    })
  }

  request.user = user
}
