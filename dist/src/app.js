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
const basic_auth_1 = __importDefault(require("@fastify/basic-auth"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const config_1 = require("./config/config");
const cors_1 = __importDefault(require("@fastify/cors"));
async function buildServer(options) {
    const fastify = (0, fastify_1.default)(options).withTypeProvider();
    // Register CORS (← Add this block)
    await fastify.register(cors_1.default, config_1.config.cors);
    // Register plugins
    await fastify.register(basic_auth_1.default, {
        validate: async (username, password, req, reply) => {
            const user = {
                username: "admin",
                password: "password"
            };
            if (user.username !== username || user.password !== password) {
                throw new Error('Unauthorized');
            }
        },
        authenticate: true
    });
    // Register JWT for authentication
    await fastify.register(jwt_1.default, {
        secret: config_1.config.jwtAccessSecret,
        namespace: 'access'
    });
    await fastify.register(jwt_1.default, {
        secret: config_1.config.jwtRefreshSecret,
        namespace: 'refresh'
    });
    // decorator for auth middleware
    fastify.decorate("authenticate", async function (request, reply) {
        try {
            await request.accessJwtVerify();
        }
        catch (err) {
            reply.send(err);
        }
    });
    await fastify.register(swagger_1.default, {
        mode: 'dynamic',
        openapi: {
            openapi: '3.0.0',
            info: {
                title: 'Commerce Fastify API',
                version: '1.0.0',
                description: 'E-commerce API with Fastify and TypeScript',
            },
            servers: [
                {
                    url: 'https://commerce-fastify-api.onrender.com/api', // ✅ your prod base URL
                    description: 'Production server',
                },
                {
                    url: 'http://localhost:3000/api', // ✅ optional dev server
                    description: 'Local development server',
                },
            ],
            tags: [
                { name: 'Users', description: 'User management endpoints' },
                { name: 'Products', description: 'Product management endpoints' },
                { name: 'Orders', description: 'Order management endpoints' },
            ],
        },
    });
    await fastify.register(swagger_ui_1.default, {
        routePrefix: '/docs',
        staticCSP: true,
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