const fastify = require('fastify')({ logger: false })

const randoSleep = () => {
  return new Promise(resolve => {
    const timeout = Math.ceil(Math.random() * 100 + Math.random() * 400 + 100)
    setTimeout(() => resolve(timeout), timeout)
  })
}

fastify.post('/api/v1/users', async (req, reply) => {
  const timeout = await randoSleep()
  reply.code(201)
  return { timeout, user: req.body.user }
})

const start = async () => {
  try {
    await fastify.listen(3000, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
