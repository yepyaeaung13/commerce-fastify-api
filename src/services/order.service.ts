import { Prisma, PrismaClient } from "@prisma/client"


interface PaginationParams {
  skip?: number
  take?: number
  page?: number
  limit?: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

interface OrderUpdateData {
  shippingAddress?: string
  billingAddress?: string
  totalAmount?: number
  status?: OrderStatus
}

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

const prisma = new PrismaClient();

export class OrderService {
  async findAll(params: PaginationParams) {
    const skip = params.skip ?? (params.page ? (params.page - 1) * (params.limit ?? 10) : 0)
    const take = params.take ?? params.limit ?? 10

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take,
        orderBy: params.sortBy ? { [params.sortBy]: params.order || 'desc' } : undefined
      }),
      prisma.order.count()
    ])

    return { data, total }
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id }
    })
  }

  async findByUserId(userId: string, params: PaginationParams) {
    const skip = params.skip ?? (params.page ? (params.page - 1) * (params.limit ?? 10) : 0)
    const take = params.take ?? params.limit ?? 10

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take,
        orderBy: params.sortBy ? { [params.sortBy]: params.order || 'desc' } : undefined
      }),
      prisma.order.count({ where: { userId } })
    ])

    return { data, total }
  }

  async create(userId: string, data: any) {
    return prisma.order.create({
      data: {
        ...data,
        userId,
        status: 'PENDING' as OrderStatus
      }
    })
  }

  async update(id: string, data: Prisma.OrderUpdateInput) {
    const order = await prisma.order.findUnique({ where: { id } }) as { status: OrderStatus } | null;
    if (!order) {
      throw new Error('Order not found');
    }

    // Validate update data
    const allowedFields: (keyof OrderUpdateData)[] = ['shippingAddress', 'billingAddress', 'totalAmount', 'status'];
    const invalidFields = Object.keys(data).filter(key => !allowedFields.includes(key as keyof OrderUpdateData));
    
    if (invalidFields.length > 0) {
      throw new Error(`Invalid update fields: ${invalidFields.join(', ')}`);
    }

    return prisma.order.update({
      where: { id },
      data
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new Error('Order not found');
    }
    
    // Validate status transitions
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      'PENDING': ['PROCESSING', 'CANCELLED'],
      'PROCESSING': ['SHIPPED', 'CANCELLED'],
      'SHIPPED': ['DELIVERED'],
      'DELIVERED': [],
      'CANCELLED': []
    };

    if (!validTransitions[order.status as OrderStatus].includes(status)) {
      throw new Error(`Invalid status transition from ${order.status} to ${status}`);
    }

    return prisma.order.update({
      where: { id },
      data: { status }
    });
  }

  async delete(id: string) {
    return prisma.order.delete({
      where: { id }
    })
  }
}