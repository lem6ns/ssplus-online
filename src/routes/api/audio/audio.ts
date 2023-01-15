import { FastifyPluginAsync, FastifyRequest } from "fastify";
import * as config from "../../../../config.json";

const audio: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	type Request = FastifyRequest<{
		Params: { id: string };
	}>;

	fastify.get("/:id", async function (request: Request, reply) {
		return request.params.id;
	});
};

export const autoPrefix = config.siteRoutes.audio;
export default audio;
