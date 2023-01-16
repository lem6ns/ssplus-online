import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { maps } from "../../../util/getAllMaps";
import * as config from "../../../../config.json";
import { getAudio } from "../../../util/parser";

const audio: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
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

		reply.header("Content-Type", `audio/${map.music_format}`);
		return getAudio(map);
	});
};

export const autoPrefix = config.siteRoutes.audio;
export default audio;
