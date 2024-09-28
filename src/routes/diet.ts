import type { FastifyInstance } from 'fastify'
import z from 'zod'
import { checkSessionIdExists } from '../middlewares/check-id-exists'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function dietRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createDietBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { name, description, isOnDiet, date } = createDietBodySchema.parse(
        request.body
      )

      await knex('diet').insert({
        id: randomUUID(),
        user_id: request.user?.id,
        name: name,
        description: description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
      })
    }
  )

  app.put(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const updateDietParamsSchema = z.object({
        mealId: z.string(),
      })

      const { mealId } = updateDietParamsSchema.parse(request.params)

      const updateDietBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { name, description, isOnDiet, date } = updateDietBodySchema.parse(
        request.body
      )

      const dietIdExists = await knex('diet')
        .select('*')
        .where('id', mealId)
        .first()

      if (!dietIdExists) {
        return reply.status(400).send({ message: 'The diet does not exist' })
      }

      await knex('diet')
        .update({
          name: name,
          description: description,
          is_on_diet: isOnDiet,
          date: date.getTime(),
        })
        .where('id', mealId)
    }
  )

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const diet = await knex('diet').where('user_id', request.user?.id)

      return reply.status(200).send({ diet })
    }
  )
}
