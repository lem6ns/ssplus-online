import { FastifyPluginAsync } from "fastify"

const audio: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/audio', async function (request, reply) {
    return '/audio'
  })
}

export default audio;
