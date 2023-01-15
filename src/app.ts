import { join } from 'path';
import AutoLoad, {AutoloadPluginOptions} from '@fastify/autoload';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { FastifyPluginAsync } from 'fastify';

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;


// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
}

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  });

  void fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: "Sound Space+ Online Services API",
        description: "WooHoo",
        version: "0.0.1"
      }
    }
  })

  void fastify.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  })
};

export default app;
export { app, options }
