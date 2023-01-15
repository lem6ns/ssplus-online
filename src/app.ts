import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import * as config from "../config.json";

export type AppOptions = {
	// Place your custom options for app below here.
	trustProxy: boolean;
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
	trustProxy: config.trustProxy,
};

const app: FastifyPluginAsync<AppOptions> = async (
	fastify,
	opts,
): Promise<void> => {
	// Place here your custom code!

	// Do not touch the following lines

	// This loads all plugins defined in routes
	// define your routes in one of these
	void fastify.register(AutoLoad, {
		dir: join(__dirname, "routes"),
		options: opts,
	});
};

export default app;
export { app, options };
