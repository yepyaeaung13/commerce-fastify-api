
import { Prisma, PrismaClient } from '@prisma/client'
import type { Product, PaginationParams } from '../types'

const prisma = new PrismaClient();

export class ProductService {
  async findAll(params: PaginationParams) {
    const skip = params.skip ?? (params.page ? (params.page - 1) * (params.limit ?? 10) : 0)
    const take = params.take ?? params.limit ?? 10

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take,
        orderBy: params.sortBy ? { [params.sortBy]: params.order || 'desc' } : undefined
      }),
      prisma.product.count()
    ])

    return { data, total }
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id }
    })
  }

  async findByCategory(categoryId: string, params: PaginationParams) {
    const skip = params.skip ?? (params.page ? (params.page - 1) * (params.limit ?? 10) : 0)
    const take = params.take ?? params.limit ?? 10

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where: { categoryId },
        skip,
        take,
        orderBy: params.sortBy ? { [params.sortBy]: params.order || 'desc' } : undefined
      }),
      prisma.product.count({ where: { categoryId } })
    ])

    return { data, total }
  }

  async create(data: Partial<Product>) {
    return prisma.product.create({
      data: data as any
    })
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data
    })
  }

  async updateStock(id: string, quantity: number) {
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      throw new Error('Product not found')
    }

    const currentQuantity = product.quantity ?? 0
    if (currentQuantity + quantity < 0) {
      throw new Error('Insufficient stock')
    }

    return prisma.product.update({
      where: { id },
      data: {
        quantity: currentQuantity + quantity,
        inStock: (currentQuantity + quantity) > 0
      }
    })
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id }
    })
  }
}