import fastify from 'fastify'
import { dietRoutes } from './routes/diet'
import { usersRoutes } from './routes/users'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyCookie)
app.register(dietRoutes, {
  prefix: 'diet',
})
app.register(usersRoutes, {
  prefix: 'users',
})
