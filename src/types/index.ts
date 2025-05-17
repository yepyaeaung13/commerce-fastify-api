import type { Order, Product, User } from '@prisma/client'

export type { Order, Product, User }
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR'
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export type CartItem = {
  productId: string;
  quantity: number;
}

export type JWTPayload = {
  id: string
  email: string
  role: UserRole
}

export type PaginationParams = {
  page?: number
  limit?: number
  skip?: number
  take?: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

export type ApiResponse<T> = {
  status: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page: number
    limit: number
    total: number
  }
}

export type UserInfoResponse = {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
}

