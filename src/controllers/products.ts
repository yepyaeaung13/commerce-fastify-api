import { FastifyRequest, FastifyReply } from 'fastify'
import { ProductService } from '../services/product.service'
import { createPagination, formatResponse } from '../utils/helpers'

const productService = new ProductService()

export async function getProducts(request: FastifyRequest, reply: FastifyReply) {
  try {
    const pagination = createPagination(request.query as any)
    const { categoryId } = request.query as { categoryId?: string }

    const result = categoryId 
      ? await productService.findByCategory(categoryId, pagination)
      : await productService.findAll(pagination)
    
    return reply.send(formatResponse(result.data, undefined, {
      page: pagination.page,
      limit: pagination.take,
      total: result.total
    }))
  } catch (error: any) {
    return reply.status(500).send(formatResponse(null, error?.message || 'Internal server error'))
  }
}

export async function getProductById(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    const product = await productService.findById(id)
    
    if (!product) {
      return reply.status(404).send(formatResponse(null, 'Product not found'))
    }
    
    return reply.send(formatResponse(product))
  } catch (error: any) {
    return reply.status(500).send(formatResponse(null, error?.message || 'Internal server error'))
  }
}

export async function createProduct(request: FastifyRequest, reply: FastifyReply) {
  try {
    const productData = request.body as any
    const product = await productService.create(productData)
    return reply.status(201).send(formatResponse(product))
  } catch (error: any) {
    return reply.status(500).send(formatResponse(null, error?.message || 'Internal server error'))
  }
}

export async function updateProduct(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    const productData = request.body as any
    
    const product = await productService.update(id, productData)
    return reply.send(formatResponse(product))
  } catch (error: any) {
    return reply.status(500).send(formatResponse(null, error?.message || 'Internal server error'))
  }
}

export async function deleteProduct(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    await productService.delete(id)
    return reply.send(formatResponse({ success: true }))
  } catch (error: any) {
    return reply.status(500).send(formatResponse(null, error?.message || 'Internal server error'))
  }
}

export async function updateProductStock(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    const { quantity } = request.body as { quantity: number }
    
    const product = await productService.updateStock(id, quantity)
    return reply.send(formatResponse(product))
  } catch (error: any) {
    return reply.status(500).send(formatResponse(null, error?.message || 'Internal server error'))
  }
}
