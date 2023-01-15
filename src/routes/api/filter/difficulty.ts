import { FastifyPluginAsync, FastifyRequest } from "fastify";

const difficulty: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	type Request = FastifyRequest<{
		Querystring: { filter: string };
	}>;

	fastify.get("*", async function (request: Request, reply) {
		const { filter: filterString } = request.query;
		if (!filterString) return reply.status(400).send("400 Bad Request");

		const filterArray = filterString.split(",");
		return filterArray;
	});
};

export default difficulty;
