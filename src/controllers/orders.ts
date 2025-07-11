import { FastifyRequest, FastifyReply } from 'fastify'
import { OrderService } from '../services/order.service'
import { createPagination, errorResponse, successResponse, successResponseWithMeta } from '../utils/helpers'
import type { OrderStatus } from '../types'

const orderService = new OrderService()

export async function getOrders(request: FastifyRequest, reply: FastifyReply) {
  try {
    const pagination = createPagination(request.query as any)
    const { userId } = request.query as { userId?: string }

    const result = userId
      ? await orderService.findByUserId(userId, pagination)
      : await orderService.findAll(pagination)

    return reply.send(successResponseWithMeta(result.data, {
      page: pagination.page,
      limit: pagination.take,
      total: result.total
    }, 'Orders retrieved successfully'))
  } catch (error) {
    return reply.status(500).send(errorResponse( (error as Error).message))
  }
}

export async function getOrderById(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    const order = await orderService.findById(id)

    if (!order) {
      return reply.status(404).send(errorResponse( 'Order not found'))
    }

    return reply.send(successResponse(order, 'Order retrieved successfully'))
  } catch (error) {
    return reply.status(500).send(errorResponse( (error as Error).message))
  }
}

export async function createOrder(request: FastifyRequest, reply: FastifyReply) {
  try {
    const orderData = request.body as {
      items: Array<{ productId: string; quantity: number }>
      address: any
    }
    const { userId } = request.body as { userId: string }

    const order = await orderService.create(userId, {
      items: orderData.items,
      address: orderData.address
    })
    return reply.status(201).send(successResponse(order, 'Order created successfully'))
  } catch (error) {
    return reply.status(500).send(errorResponse( (error as Error).message))
  }
}

export async function updateOrderStatus(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    const { status } = request.body as { status: OrderStatus }

    const order = await orderService.update(id, { status })
    return reply.send(successResponse(order, 'Order status updated successfully'))
  } catch (error) {
    return reply.status(500).send(errorResponse( (error as Error).message))
  }
}

export async function deleteOrder(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    
    // Check if order exists
    const existingOrder = await orderService.findById(id)
    if (!existingOrder) {
      return reply.status(404).send(errorResponse( 'Order not found'))
    }

    await orderService.delete(id)
    return reply.send(successResponse({}, 'Order deleted successfully'))
  } catch (error) {
    return reply.status(500).send(errorResponse( (error as Error).message))
  }
}
