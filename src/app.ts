import Fastify from "fastify";
import { type TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { Options } from "../server";
import userRoutes from "./routes/users";
import productRoutes from "./routes/products";
import { orderRoutes } from "./routes/orders";

export async function buildServer(options: Options) {
    const fastify = Fastify(options).withTypeProvider<TypeBoxTypeProvider>();

    // Register plugins
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
            host: "localhost:3000",
            schemes: ["http"],
            consumes: ["application/json"],
            produces: ["application/json"],
            tags: [
                { name: 'Users', description: 'User management endpoints' },
                { name: 'Products', description: 'Product management endpoints' },
                { name: 'Orders', description: 'Order management endpoints' }
            ]
        }
    });

    // Register Swagger UI
    await fastify.register(swaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false
        },
        staticCSP: true
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
