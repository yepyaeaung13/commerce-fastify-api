import { FastifyRequest, FastifyReply } from 'fastify'
import { ProductService } from '../services/product.service'
import { createPagination, errorResponse, successResponse, successResponseWithMeta } from '../utils/helpers'

const productService = new ProductService()

export async function getProducts(request: FastifyRequest, reply: FastifyReply) {
  try {
    const pagination = createPagination(request.query as any)
    const { categoryId } = request.query as { categoryId?: string }

    const result = categoryId 
      ? await productService.findByCategory(categoryId, pagination)
      : await productService.findAll(pagination)
    
    return reply.send(successResponseWithMeta(result.data, {
      page: pagination.page,
      limit: pagination.take,
      total: result.total
    }, 'Products retrieved successfully'))
  } catch (error: any) {
    return reply.status(500).send(errorResponse(error?.message || 'Internal server error'))
  }
}

export async function getProductById(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    const product = await productService.findById(id)
    
    if (!product) {
      return reply.status(404).send(errorResponse('Product not found'))
    }
    
    return reply.send(successResponse(product, 'Product retrieved successfully'))
  } catch (error: any) {
    return reply.status(500).send(errorResponse(error?.message || 'Internal server error'))
  }
}

export async function createProduct(request: FastifyRequest, reply: FastifyReply) {
  try {
    const productData = request.body as any
    const product = await productService.create(productData)
    return reply.status(201).send(successResponse(product, 'Product created successfully'))
  } catch (error: any) {
    return reply.status(500).send(errorResponse(error?.message || 'Internal server error'))
  }
}

export async function updateProduct(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    const productData = request.body as any
    
    const product = await productService.update(id, productData)
    return reply.send(successResponse(product, 'Product updated successfully'))
  } catch (error: any) {
    return reply.status(500).send(errorResponse(error?.message || 'Internal server error'))
  }
}

export async function deleteProduct(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    await productService.delete(id)
    return reply.send(successResponse({}, 'Product deleted successfully'))
  } catch (error: any) {
    return reply.status(500).send(errorResponse(error?.message || 'Internal server error'))
  }
}

export async function updateProductStock(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    const { quantity } = request.body as { quantity: number }
    
    const product = await productService.updateStock(id, quantity)
    return reply.send(successResponse(product, 'Product stock updated successfully'))
  } catch (error: any) {
    return reply.status(500).send(errorResponse(error?.message || 'Internal server error'))
  }
}
