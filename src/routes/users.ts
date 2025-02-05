import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'
import { comparePasswordHash } from '../utils/compare-password-hash'
import { returnPasswordHash } from '../utils/return-password-hash'
import { checkSessionIdExists } from '../middlewares/check-id-exists'
import fs from 'fs';

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

  app.put('/:userId', 
    {
    preHandler: [checkSessionIdExists],
    }, 
    async (request, reply) => {
      const updateUserParamsSchema = z.object({
        userId: z.string().uuid(),
      })

      const updateUserBodySchema = z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        avatar: z.string().optional(),
      })

      const path = require('path');

      try{

        const { userId } = updateUserParamsSchema.parse(request.params)
        const { name, email, avatar } = updateUserBodySchema.parse(request.body)
        
        const userExists = await knex('users')
        .select('*')
        .where('id', userId)
        .first()
        
        if(!userExists){
          return reply.status(400).send({ error: 'User not found' })
        }

        if(avatar){
          const uploadDir = path.join(__dirname, '..', '..', '..', 'reactjs_dailydiet', 'images', 'users');

          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
          }

          const buffer = Buffer.from(avatar.split(',')[1], 'base64');  // Remove a parte do cabeçalho data:image/png;base64, 
          const filePath = path.join(uploadDir, `${userId}_avatar.png`);
          const filePathDB = path.join(`${userId}_avatar.png`);
  
          fs.writeFileSync(filePath, buffer);
  
          await knex('users')
          .update({
            name: name,
            email: email,
            avatar: filePathDB
          })
          .where('id', userId)
        }else{
          await knex('users')
          .update({
            name: name,
            email: email
          })
          .where('id', userId)
        }

        return reply.status(200).send({ message: 'The user has been updated' })
      }catch (error) {
        if (error instanceof z.ZodError) {
          return reply
            .status(400)
            .send({ error: 'Invalid parameters', issues: error.errors })
        }

        return reply
          .status(500)
          .send({ error: 'An error occurred while updating the user: ' + error })
      }
    }
  )

  app.get('/', async (request, reply) => {
    try {
      const sessionId = request.cookies.sessionId

      if (!sessionId) {
        return reply.status(401).send({
          error: 'Unauthorized. No sessionId found in cookies.',
        })
      }

      const user = await knex('users')
      .select('*')
      .where('session_id', sessionId)
      .first()

      return reply.status(200).send({ user })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply
          .status(400)
          .send({ error: 'Invalid parameters', issues: error.errors })
      }

      return reply
        .status(500)
        .send({ error: 'An error occurred while searching the user' })
    }
  })
}
