"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = buildServer;
const fastify_1 = __importDefault(require("fastify"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const users_1 = __importDefault(require("./routes/users"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = require("./routes/orders");
async function buildServer(options) {
    const fastify = (0, fastify_1.default)(options).withTypeProvider();
    // Register plugins
    await fastify.register(swagger_1.default, {
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
    await fastify.register(swagger_ui_1.default, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false
        },
        staticCSP: true
    });
    // Register routes
    await fastify.register(users_1.default, { prefix: "/api/users" });
    await fastify.register(products_1.default, { prefix: "/api/products" });
    await fastify.register(orders_1.orderRoutes, { prefix: "/api/orders" });
    // Health check route
    fastify.get("/health", async () => {
        return { status: "ok", timestamp: new Date().toISOString() };
    });
    return fastify;
}
//# sourceMappingURL=app.js.map