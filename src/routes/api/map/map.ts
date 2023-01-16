import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { mapsClean } from "../../../util/getAllMaps";

const map: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	type Request = FastifyRequest<{
		Params: { id: string };
	}>;

	fastify.get("/:id", async function (request: Request, reply) {
		const map = mapsClean[request.params.id];
		if (!map) {
			reply.status(404);
			return {
				error: "022-310",
				info: "Map with requested ID does not exist",
			};
		}

		return map;
	});
};

export default map;
