import { FastifyPluginAsync } from "fastify"

const cover: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/cover', async function (request, reply) {
    return '/cover'
  })
}

export default cover;
