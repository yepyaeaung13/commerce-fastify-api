import { Prisma, PrismaClient } from '@prisma/client'
import type { User, PaginationParams } from '../types'

const prisma = new PrismaClient()

export class UserService {
  async findAll(params: PaginationParams) {
    const skip = params.skip ?? (params.page ? (params.page - 1) * (params.limit ?? 10) : 0)
    const take = params.take ?? params.limit ?? 10

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        orderBy: params.sortBy ? { [params.sortBy]: params.order || 'desc' } : undefined
      }),
      prisma.user.count()
    ])

    return { data, total }
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    })
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    })
  }

  async create(data: Partial<User>) {
    return prisma.user.create({
      data: data as any
    })
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data
    })
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id }
    })
  }
}