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
exports.default = productRoutes;
const typebox_1 = require("@sinclair/typebox");
const auth_1 = require("../middleware/auth");
const ProductController = __importStar(require("../controllers/products"));
async function productRoutes(fastify) {
    // Get all products (public)
    fastify.get('/', {
        schema: {
            tags: ['Products'],
            querystring: typebox_1.Type.Object({
                page: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 1 })),
                limit: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 1, maximum: 100 })),
                categoryId: typebox_1.Type.Optional(typebox_1.Type.String()),
            }),
        },
    }, ProductController.getProducts);
    // Get product by ID (public)
    fastify.get('/:id', {
        schema: {
            tags: ['Products'],
            params: typebox_1.Type.Object({
                id: typebox_1.Type.String(),
            }),
        },
    }, ProductController.getProductById);
    // Create new product (protected, admin only)
    fastify.post('/', {
        preHandler: [auth_1.authenticate],
        schema: {
            tags: ['Products'],
            body: typebox_1.Type.Object({
                name: typebox_1.Type.String({ minLength: 1, maxLength: 255 }),
                description: typebox_1.Type.String(),
                price: typebox_1.Type.Number({ minimum: 0 }),
                categoryId: typebox_1.Type.String(),
                quantity: typebox_1.Type.Number({ minimum: 0 }),
                imageUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
                tags: typebox_1.Type.Optional(typebox_1.Type.String()),
            }),
        },
    }, ProductController.createProduct);
    // Update product (protected, admin only)
    fastify.put('/:id', {
        preHandler: [auth_1.authenticate],
        schema: {
            tags: ['Products'],
            params: typebox_1.Type.Object({
                id: typebox_1.Type.String(),
            }),
            body: typebox_1.Type.Object({
                name: typebox_1.Type.Optional(typebox_1.Type.String({ minLength: 1, maxLength: 255 })),
                description: typebox_1.Type.Optional(typebox_1.Type.String()),
                price: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0 })),
                categoryId: typebox_1.Type.Optional(typebox_1.Type.String()),
                quantity: typebox_1.Type.Optional(typebox_1.Type.Number({ minimum: 0 })),
                imageUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
                tags: typebox_1.Type.Optional(typebox_1.Type.String()),
            }),
        },
    }, ProductController.updateProduct);
    // Update product stock (protected, admin only)
    fastify.patch('/:id/stock', {
        preHandler: [auth_1.authenticate],
        schema: {
            tags: ['Products'],
            params: typebox_1.Type.Object({
                id: typebox_1.Type.String(),
            }),
            body: typebox_1.Type.Object({
                quantity: typebox_1.Type.Number({ minimum: 0 }),
            }),
        },
    }, ProductController.updateProductStock);
    // Delete product (protected, admin only)
    fastify.delete('/:id', {
        preHandler: [auth_1.authenticate],
        schema: {
            tags: ['Products'],
            params: typebox_1.Type.Object({
                id: typebox_1.Type.String(),
            }),
        },
    }, ProductController.deleteProduct);
}
//# sourceMappingURL=products.js.map