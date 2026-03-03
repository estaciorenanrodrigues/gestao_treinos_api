import dotenv from 'dotenv'
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { z } from 'zod/v4'
dotenv.config()

import Fastify from 'fastify'
const app = Fastify({
    logger: true
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

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