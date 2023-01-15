import { FastifyPluginAsync } from "fastify"

const all: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/all', async function (request, reply) {
    return '/all'
  })
}

export default all;
