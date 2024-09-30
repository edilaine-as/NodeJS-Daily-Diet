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

      try {
        const { name, description, isOnDiet, date } =
          createDietBodySchema.parse(request.body)

        await knex('diet').insert({
          id: randomUUID(),
          user_id: request.user?.id,
          name: name,
          description: description,
          is_on_diet: isOnDiet,
          date: date.getTime(),
        })

        return reply.status(201).send({ message: 'The diet has been created' })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply
            .status(400)
            .send({ error: 'Invalid parameters', issues: error.errors })
        }

        return reply
          .status(500)
          .send({ error: 'An error occurred while creating the diet' })
      }
    }
  )

  app.put(
    '/:dietId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const updateDietParamsSchema = z.object({
        dietId: z.string().uuid(),
      })

      const updateDietBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })

      try {
        const { dietId } = updateDietParamsSchema.parse(request.params)
        const { name, description, isOnDiet, date } =
          updateDietBodySchema.parse(request.body)

        const dietExists = await knex('diet')
          .select('*')
          .where('id', dietId)
          .first()

        if (!dietExists) {
          return reply.status(400).send({ error: 'Diet not found' })
        }

        await knex('diet')
          .update({
            name: name,
            description: description,
            is_on_diet: isOnDiet,
            date: date.getTime(),
          })
          .where('id', dietId)

        return reply.status(200).send({ message: 'The diet has been updated' })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply
            .status(400)
            .send({ error: 'Invalid parameters', issues: error.errors })
        }

        return reply
          .status(500)
          .send({ error: 'An error occurred while updating the diet' })
      }
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

  app.get(
    '/:dietId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const paramsSchema = z.object({
        dietId: z.string().uuid(),
      })

      try {
        const { dietId } = paramsSchema.parse(request.params)

        const diet = await knex('diet')
          .where({
            user_id: request.user?.id,
            id: dietId,
          })
          .first()

        if (!diet) {
          return reply.status(400).send({ error: 'Diet not found' })
        }

        return reply.status(200).send({ diet })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply
            .status(400)
            .send({ error: 'Invalid parameters', issues: error.errors })
        }

        return reply
          .status(500)
          .send({ error: 'An error occurred while searching the diet' })
      }
    }
  )

  app.delete(
    '/:dietId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const paramsSchema = z.object({
        dietId: z.string().uuid(),
      })

      try {
        const { dietId } = paramsSchema.parse(request.params)

        const dietExists = await knex('diet').where('id', dietId).first()

        if (!dietExists) {
          return reply.status(404).send({ error: 'Diet not found' })
        }

        await knex('diet').where('id', dietId).del()

        return reply.status(204).send()
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply
            .status(400)
            .send({ error: 'Invalid parameters', issues: error.errors })
        }

        return reply
          .status(500)
          .send({ error: 'An error occurred while deleting the diet' })
      }
    }
  )

  app.get(
    '/metrics',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const totalDiets = knex('diet')
        .where({ user_id: request.user?.id })
        .orderBy('date', 'desc')

      const totalDietsOnDiet = knex('diet').where({
        user_id: request.user?.id,
        is_on_diet: true,
      })

      const totalDietsOffDiet = knex('diet').where({
        user_id: request.user?.id,
        is_on_diet: false,
      })

      const { bestOnDietSequence } = (await totalDiets).reduce(
        (acc, diet) => {
          if (diet.is_on_diet) {
            acc.currentSequence += 1
          } else {
            acc.currentSequence = 0
          }

          if (acc.currentSequence > acc.bestOnDietSequence) {
            acc.bestOnDietSequence = acc.currentSequence
          }

          return acc
        },
        { bestOnDietSequence: 0, currentSequence: 0 }
      )

      return reply.status(200).send({
        totalDiets: (await totalDiets).length,
        totalDietsOnDiet: (await totalDietsOnDiet).length,
        totalDietsOffDiet: (await totalDietsOffDiet).length,
        bestOnDietSequence: bestOnDietSequence,
      })
    }
  )
}
