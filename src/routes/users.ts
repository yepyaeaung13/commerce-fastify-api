import { FastifyInstance } from 'fastify'
import { Type } from '@sinclair/typebox'
import * as UserController from '../controllers/users'

export default async function userRoutes(fastify: FastifyInstance) {
  // Get all users (protected, admin only)
  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Users'],
        querystring: Type.Object({
          page: Type.Optional(Type.Number({ minimum: 1 })),
          limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100 })),
        }),
      },
    },
    UserController.getUsers
  )

  // Get user by ID (protected)
  fastify.get(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Users'],
        params: Type.Object({
          id: Type.String(),
        }),
      },
    },
    UserController.getUserById
  )

  fastify.post('/login', {
    schema: {
      tags: ['Users'],
      body: Type.Object({
        email: Type.String({ format: 'email' }),
        password: Type.String({ minLength: 8, maxLength: 100 }),
      }),
    },
}, UserController.loginUser)

  // Create new user (public - registration)
  fastify.post(
    '/register',
    {
      schema: {
        tags: ['Users'],
        body: Type.Object({
          name: Type.String({ minLength: 2, maxLength: 50 }),
          email: Type.String({ format: 'email' }),
          password: Type.String({ minLength: 8, maxLength: 100 }),
          age: Type.Number({ minimum: 13, maximum: 120 }),
          phoneNumber: Type.Optional(Type.String()),
          address: Type.Optional(Type.Object({})),
          preferences: Type.Optional(Type.Object({})),
        }),
      },
    },
    UserController.createUser
  )
  // Refresh access token (public)
  fastify.post('/refresh-token', {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ['Users'],
    }
  }, UserController.refreshAccessToken);

  // Update user (protected)
  fastify.put(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Users'],
        params: Type.Object({
          id: Type.String(),
        }),
        body: Type.Object({
          name: Type.Optional(Type.String({ minLength: 2, maxLength: 50 })),
          email: Type.Optional(Type.String({ format: 'email' })),
          password: Type.Optional(Type.String({ minLength: 8, maxLength: 100 })),
          age: Type.Optional(Type.Number({ minimum: 13, maximum: 120 })),
          phoneNumber: Type.Optional(Type.String()),
          address: Type.Optional(Type.Object({})),
          preferences: Type.Optional(Type.Object({})),
          status: Type.Optional(Type.Enum({ ACTIVE: 'ACTIVE', INACTIVE: 'INACTIVE', SUSPENDED: 'SUSPENDED' })),
        }),
      },
    },
    UserController.updateUser
  )

  // Delete user (protected, admin only)
  fastify.delete(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Users'],
        params: Type.Object({
          id: Type.String(),
        }),
      },
    },
    UserController.deleteUser
  )
}
