import { FastifyPluginAsync } from "fastify"

const difficulty: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/difficulty', async function (request, reply) {
    return '/difficulty'
  })
}

export default difficulty;
