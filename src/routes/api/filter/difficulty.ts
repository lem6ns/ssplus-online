import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { mapsClean } from "../../../util/getAllMaps";
import { Clean } from "../../../util/parser/Types";

const difficulty: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	type Request = FastifyRequest<{
		Querystring: { filter: string };
	}>;

	fastify.get("*", async function (request: Request, reply) {
		const { filter: filterString } = request.query;
		if (!filterString) return reply.status(400).send("400 Bad Request");

		const filterArray = filterString.split(",");
		const filteredResults: Clean[] = [];
		filterArray.forEach((filter) => { // there is probably a better way to do this but idc!!
			const keys = Object.keys(mapsClean);
			const filteredKeys = keys.filter((key) => mapsClean[key].difficulty === parseInt(filter));
			const mappedFilteredResults = filteredKeys.map(filteredKey => mapsClean[filteredKey]);
			filteredResults.push(...mappedFilteredResults)
		});

		return filteredResults;
	});
};

export default difficulty;
