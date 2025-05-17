import { PaginationParams, ApiResponse } from '../types'
import bcrypt from 'bcrypt'

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

export const createPagination = (params: PaginationParams) => {
  const page = Math.max(1, params.page || 1)
  const limit = Math.min(
    Math.max(1, params.limit || 10),
    100
  )
  const skip = (page - 1) * limit

  return {
    skip,
    take: limit,
    page,
  }
}

export const formatResponse = <T>(
  data: T,
  error?: string,
  meta?: ApiResponse<T>['meta']
): ApiResponse<T> => {
  if (error) {
    return {
      status: false,
      error,
    }
  }

  return {
    status: true,
    data,
    meta,
  }
}

export const sanitizeUser = (user: any) => {
  const { password, ...sanitizedUser } = user
  return sanitizedUser
}