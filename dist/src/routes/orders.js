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
exports.orderRoutes = orderRoutes;
const type_provider_typebox_1 = require("@fastify/type-provider-typebox");
const orderController = __importStar(require("../controllers/orders"));
// Define TypeBox schema for request validation
const OrderItemSchema = type_provider_typebox_1.Type.Object({
    productId: type_provider_typebox_1.Type.String(),
    quantity: type_provider_typebox_1.Type.Number({ minimum: 1 }),
    unitPrice: type_provider_typebox_1.Type.Number({ minimum: 0 })
});
const OrderSchema = type_provider_typebox_1.Type.Object({
    userId: type_provider_typebox_1.Type.String(),
    status: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.String()),
    totalAmount: type_provider_typebox_1.Type.Number({ minimum: 0 }),
    items: type_provider_typebox_1.Type.Array(OrderItemSchema)
});
const OrderParamsSchema = type_provider_typebox_1.Type.Object({
    id: type_provider_typebox_1.Type.String()
});
const OrderStatusSchema = type_provider_typebox_1.Type.Object({
    status: type_provider_typebox_1.Type.String()
});
async function orderRoutes(fastify) {
    // Get all orders
    fastify.get("/", {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Orders'],
            querystring: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.Object({
                userId: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.String()),
                status: type_provider_typebox_1.Type.Optional(type_provider_typebox_1.Type.String())
            })),
            response: {
                200: type_provider_typebox_1.Type.Array(OrderSchema)
            }
        }
    }, orderController.getOrders);
    // Get order by ID
    fastify.get("/:id", {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Orders'],
            params: OrderParamsSchema,
            response: {
                200: OrderSchema
            }
        }
    }, orderController.getOrderById);
    // Create new order
    fastify.post("/", {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Orders'],
            body: OrderSchema,
            response: {
                201: type_provider_typebox_1.Type.Object({
                    message: type_provider_typebox_1.Type.String(),
                    orderId: type_provider_typebox_1.Type.String()
                })
            }
        }
    }, orderController.createOrder);
    // Update order status
    fastify.patch("/:id/status", {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Orders'],
            params: OrderParamsSchema,
            body: OrderStatusSchema,
            response: {
                200: type_provider_typebox_1.Type.Object({
                    message: type_provider_typebox_1.Type.String(),
                    order: OrderSchema
                })
            }
        }
    }, orderController.updateOrderStatus);
    // Delete order
    fastify.delete("/:id", {
        preHandler: [fastify.authenticate],
        schema: {
            tags: ['Orders'],
            params: OrderParamsSchema,
            response: {
                200: type_provider_typebox_1.Type.Object({
                    message: type_provider_typebox_1.Type.String()
                })
            }
        }
    }, orderController.deleteOrder);
}
//# sourceMappingURL=orders.js.map