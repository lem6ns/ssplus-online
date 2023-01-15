import { FastifyPluginAsync } from "fastify";

const all: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get("/", async function (request, reply) {
		return "/";
	});
};

export default all;
