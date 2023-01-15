import { FastifyPluginAsync } from "fastify"

const txt: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/txt', async function (request, reply) {
    return '/txt'
  })
}

export default txt;
