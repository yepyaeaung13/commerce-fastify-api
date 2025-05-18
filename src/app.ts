import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import { type TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { Options } from "../server";
import userRoutes from "./routes/users";
import productRoutes from "./routes/products";
import { orderRoutes } from "./routes/orders";
import fastifyBasicAuth from '@fastify/basic-auth';
import fastifyJwt from "@fastify/jwt";
import { config } from "./config/config";
import cors from '@fastify/cors';

export async function buildServer(options: Options) {
    const fastify = Fastify(options).withTypeProvider<TypeBoxTypeProvider>();

    // Register CORS (← Add this block)
    await fastify.register(cors, {
        origin: true, // Allow all origins (or specify array/domain)
        credentials: true
    });

    // Register plugins
    await fastify.register(fastifyBasicAuth, {
        validate: async (
            username: string,
            password: string,
            req: FastifyRequest,
            reply: FastifyReply
        ): Promise<void> => {
            const user = {
                username: "admin",
                password: "password"
            }

            if (user.username !== username || user.password !== password) {
                throw new Error('Unauthorized');
            }
        },
        authenticate: true
    });

    // Register JWT for authentication
    await fastify.register(fastifyJwt, {
        secret: config.jwtAccessSecret,
        namespace: 'access'
      });
      
      await fastify.register(fastifyJwt, {
        secret: config.jwtRefreshSecret,
        namespace: 'refresh'
      });

    // decorator for auth middleware
    fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.accessJwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });

    await fastify.register(swagger, {
        swagger: {
            info: {
                title: "Commerce API",
                description: "E-commerce API with Fastify and TypeScript",
                version: "1.0.0"
            },
            externalDocs: {
                url: "https://swagger.io",
                description: "Find more info here"
            },  
            consumes: ["application/json"],
            produces: ["application/json"],
            tags: [
                { name: 'Users', description: 'User management endpoints' },
                { name: 'Products', description: 'Product management endpoints' },
                { name: 'Orders', description: 'Order management endpoints' }
            ]
        }
    });

    // Register Swagger UI with basic auth
    await fastify.register(swaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false
        },
        staticCSP: true,
        uiHooks: {
            onRequest: (request, reply, done) => {
                // Use fastify's basicAuth hook manually
                fastify.basicAuth(request, reply, done);
            }
        }
    });

    // Register routes
    await fastify.register(userRoutes, { prefix: "/api/users" });
    await fastify.register(productRoutes, { prefix: "/api/products" });
    await fastify.register(orderRoutes, { prefix: "/api/orders" });

    // Health check route
    fastify.get("/health", async () => {
        return { status: "ok", timestamp: new Date().toISOString() };
    });

    return fastify;
}
