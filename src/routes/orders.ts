import { FastifyInstance } from "fastify";
import { Type } from "@fastify/type-provider-typebox";
import * as orderController  from "../controllers/orders";

// Define TypeBox schema for request validation
const OrderItemSchema = Type.Object({
  productId: Type.String(),
  quantity: Type.Number({ minimum: 1 }),
  unitPrice: Type.Number({ minimum: 0 })
});

const OrderSchema = Type.Object({
  userId: Type.String(),
  status: Type.Optional(Type.String()),
  totalAmount: Type.Number({ minimum: 0 }),
  items: Type.Array(OrderItemSchema)
});

const OrderParamsSchema = Type.Object({
  id: Type.String()
});

const OrderStatusSchema = Type.Object({
  status: Type.String()
});

export async function orderRoutes(fastify: FastifyInstance) {
  // Get all orders
  fastify.get("/", {
    schema: {
      tags: ['Orders'],
      querystring: Type.Optional(Type.Object({
        userId: Type.Optional(Type.String()),
        status: Type.Optional(Type.String())
      })),
      response: {
        200: Type.Array(OrderSchema)
      }
    }
  }, orderController.getOrders);

  // Get order by ID
  fastify.get("/:id", {
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
    schema: {
      tags: ['Orders'],
      body: OrderSchema,
      response: {
        201: Type.Object({
          message: Type.String(),
          orderId: Type.String()
        })
      }
    }
  }, orderController.createOrder);

  // Update order status
  fastify.patch("/:id/status", {
    schema: {
      tags: ['Orders'],
      params: OrderParamsSchema,
      body: OrderStatusSchema,
      response: {
        200: Type.Object({
          message: Type.String(),
          order: OrderSchema
        })
      }
    }
  }, orderController.updateOrderStatus);

  // Delete order
  fastify.delete("/:id", {
    schema: {
      tags: ['Orders'],
      params: OrderParamsSchema,
      response: {
        200: Type.Object({
          message: Type.String()
        })
      }
    }
  }, orderController.deleteOrder);
}
