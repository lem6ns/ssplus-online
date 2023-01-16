import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { maps } from "../../../util/getAllMaps";
import * as config from "../../../../config.json";
import { getCover } from "../../../util/parser";

const cover: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	type Request = FastifyRequest<{
		Params: { id: string };
	}>;

	fastify.get("/:id", async function (request: Request, reply) {
		const map = maps[request.params.id];
		if (!map) {
			reply.status(404);
			return {
				error: "022-310",
				info: "Map with requested ID does not exist",
			};
		};
		
		reply.header("Content-Type", "image/png");
		return getCover(map);
	});
};

export const autoPrefix = config.siteRoutes.cover;
export default cover;
