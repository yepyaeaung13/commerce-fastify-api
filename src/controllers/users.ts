import { FastifyRequest, FastifyReply } from 'fastify'
import { UserService } from '../services/user.service'
import { createPagination, formatResponse } from '../utils/helpers'

const userService = new UserService()

export async function getUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const pagination = createPagination(request.query as any)
    const result = await userService.findAll(pagination)
    
    return reply.send(formatResponse(result.data, undefined, {
      page: pagination.page,
      limit: pagination.take,
      total: result.total
    }))
  } catch (error: any) {
    return reply.status(500).send(formatResponse(null, error?.message || 'Internal server error'))
  }
}

export async function getUserById(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    const user = await userService.findById(id)
    
    if (!user) {
      return reply.status(404).send(formatResponse(null, 'User not found'))
    }
    
    return reply.send(formatResponse(user))
  } catch (error: any) {
    return reply.status(500).send(formatResponse(null, error?.message || 'Internal server error'))
  }
}

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userData = request.body as any
    const user = await userService.create(userData)
    return reply.status(201).send(formatResponse(user))
  } catch (error: any) {
    return reply.status(500).send(formatResponse(null, error?.message || 'Internal server error'))
  }
}

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    const userData = request.body as any
    
    const user = await userService.update(id, userData)
    return reply.send(formatResponse(user))
  } catch (error: any) {
    return reply.status(500).send(formatResponse(null, error?.message || 'Internal server error'))
  }
}

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    await userService.delete(id)
    return reply.send(formatResponse({ success: true }))
  } catch (error: any) {
    return reply.status(500).send(formatResponse(null, error?.message || 'Internal server error'))
  }
}
