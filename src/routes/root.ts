import { FastifyPluginAsync } from "fastify";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get("/", async function (request, reply) {
		reply.redirect("https://github.com/lem6ns/ssplus-online");
	});
};

export default root;
