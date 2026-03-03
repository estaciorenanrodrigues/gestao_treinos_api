import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import dotenv from 'dotenv'
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { z } from 'zod/v4'


dotenv.config()

import Fastify from 'fastify'
const app = Fastify({
    logger: true
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Bootcamp Treinos API',
            description: 'API for the Bootcamp Treinos project',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
        ],
    },
    transform: jsonSchemaTransform,
});

await app.register(fastifySwaggerUI, {
    routePrefix: '/docs',
});

app.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',
    url: '/',
    schema: {
        description: 'Hello World',
        tags: ['hello'],
        response: {
            200: z.object({
                message: z.string()

            }),
        },
    },
    handler: () => {
        return {
            message: 'Hello World response',
        }
    }
});

try {
    await app.listen({ port: Number(process.env.PORT) })
} catch (err) {
    app.log.error(err)
    process.exit(1)
}