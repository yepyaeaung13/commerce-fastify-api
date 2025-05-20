"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const typebox_1 = require("@sinclair/typebox");
const UserController = __importStar(require("../controllers/users"));
async function userRoutes(fastify) {
    // Get all users (protected, admin only)
    fastify.get('/', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Users'],
            querystring: typebox_1.Type.Object({
                page: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 1 })),
                limit: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 1, maximum: 100 })),
            }),
        },
    }, UserController.getUsers);
    // Get user by ID (protected)
    fastify.get('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Users'],
            params: typebox_1.Type.Object({
                id: typebox_1.Type.String(),
            }),
        },
    }, UserController.getUserById);
    fastify.post('/login', {
        schema: {
            tags: ['Users'],
            body: typebox_1.Type.Object({
                email: typebox_1.Type.String({ format: 'email' }),
                password: typebox_1.Type.String({ minLength: 8, maxLength: 100 }),
            }),
        },
    }, UserController.loginUser);
    // Create new user (public - registration)
    fastify.post('/register', {
        schema: {
            tags: ['Users'],
            body: typebox_1.Type.Object({
                name: typebox_1.Type.String({ minLength: 2, maxLength: 50 }),
                email: typebox_1.Type.String({ format: 'email' }),
                password: typebox_1.Type.String({ minLength: 8, maxLength: 100 }),
                age: typebox_1.Type.Number({ minimum: 13, maximum: 120 }),
                phoneNumber: typebox_1.Type.Optional(typebox_1.Type.String()),
                address: typebox_1.Type.Optional(typebox_1.Type.Object({})),
                preferences: typebox_1.Type.Optional(typebox_1.Type.Object({})),
            }),
        },
    }, UserController.createUser);
    // Refresh access token (public)
    fastify.post('/refresh-token', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Users'],
        }
    }, UserController.refreshAccessToken);
    // Update user (protected)
    fastify.put('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Users'],
            params: typebox_1.Type.Object({
                id: typebox_1.Type.String(),
            }),
            body: typebox_1.Type.Object({
                name: typebox_1.Type.Optional(typebox_1.Type.String({ minLength: 2, maxLength: 50 })),
                email: typebox_1.Type.Optional(typebox_1.Type.String({ format: 'email' })),
                password: typebox_1.Type.Optional(typebox_1.Type.String({ minLength: 8, maxLength: 100 })),
                age: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 13, maximum: 120 })),
                phoneNumber: typebox_1.Type.Optional(typebox_1.Type.String()),
                address: typebox_1.Type.Optional(typebox_1.Type.Object({})),
                preferences: typebox_1.Type.Optional(typebox_1.Type.Object({})),
                status: typebox_1.Type.Optional(typebox_1.Type.Enum({ ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE', SUSPENDED: 'SUSPENDED' })),
            }),
        },
    }, UserController.updateUser);
    // Delete user (protected, admin only)
    fastify.delete('/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Users'],
            params: typebox_1.Type.Object({
                id: typebox_1.Type.String(),
            }),
        },
    }, UserController.deleteUser);
}
//# sourceMappingURL=users.js.map