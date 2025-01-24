import fastify from 'fastify'
import { dietRoutes } from './routes/diet'
import { usersRoutes } from './routes/users'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyCookie)
app.register(require('@fastify/cors'), {
  origin: '*',
  // 'http://127.0.0.1:5173',
  // origin: 'http://localhost:5173', // ou '*' para permitir qualquer origem
  credentials: true, // Permitir envio de cookies
})

app.get('/', async (request, reply) => {
  reply.send({ status: 'ok' })
})

app.register(dietRoutes, {
  prefix: 'diet',
})
app.register(usersRoutes, {
  prefix: 'users',
})
