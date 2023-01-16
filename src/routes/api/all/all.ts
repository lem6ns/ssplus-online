import { FastifyPluginAsync } from "fastify";
import { mapsClean } from "../../../util/getAllMaps";

const all: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get("/", async function (request, reply) {
		return mapsClean;
	});
};

export default all;
