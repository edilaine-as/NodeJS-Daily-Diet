import fastify from 'fastify'
import { dietRoutes } from './routes/diet'
import { usersRoutes } from './routes/users'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

const allowedOrigins = ['http://127.0.0.1:5173', 'http://localhost:5173']

app.register(fastifyCookie)
app.register(require('@fastify/cors'), {
  origin: allowedOrigins,
  // ou '*' para permitir qualquer origem
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
