import { FastifyPluginAsync } from "fastify"

const download: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/download', async function (request, reply) {
    return '/download'
  })
}

export default download;
