import { FastifyInstance } from 'fastify'
import { Type } from '@sinclair/typebox'
import * as ProductController from '../controllers/products'

export default async function productRoutes(fastify: FastifyInstance) {
  // Get all products (public)
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Products'],
        querystring: Type.Object({
          page: Type.Optional(Type.Number({ minimum: 1 })),
          limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
          categoryId: Type.Optional(Type.String()),
        }),
      },
    },
    ProductController.getProducts
  )

  // Get product by ID (public)
  fastify.get(
    '/:id',
    {
      schema: {
        tags: ['Products'],
        params: Type.Object({
          id: Type.String(),
        }),
      },
    },
    ProductController.getProductById
  )

  // Create new product (protected, admin only)
  fastify.post(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Products'],
        body: Type.Object({
          name: Type.String({ minLength: 1, maxLength: 255 }),
          description: Type.String(),
          price: Type.Number({ minimum: 0 }),
          categoryId: Type.String(),
          quantity: Type.Number({ minimum: 0 }),
          imageUrl: Type.Optional(Type.String()),
          tags: Type.Optional(Type.String()),
        }),
      },
    },
    ProductController.createProduct
  )

  // Update product (protected, admin only)
  fastify.put(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Products'],
        params: Type.Object({
          id: Type.String(),
        }),
        body: Type.Object({
          name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
          description: Type.Optional(Type.String()),
          price: Type.Optional(Type.Number({ minimum: 0 })),
          categoryId: Type.Optional(Type.String()),
          quantity: Type.Optional(Type.Number({ minimum: 0 })),
          imageUrl: Type.Optional(Type.String()),
          tags: Type.Optional(Type.String()),
        }),
      },
    },
    ProductController.updateProduct
  )

  // Update product stock (protected, admin only)
  fastify.patch(
    '/:id/stock',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Products'],
        params: Type.Object({
          id: Type.String(),
        }),
        body: Type.Object({
          quantity: Type.Number({ minimum: 0 }),
        }),
      },
    },
    ProductController.updateProductStock
  )

  // Delete product (protected, admin only)
  fastify.delete(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Products'],
        params: Type.Object({
          id: Type.String(),
        }),
      },
    },
    ProductController.deleteProduct
  )
}
