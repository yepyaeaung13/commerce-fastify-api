import fastifyJwt from '@fastify/jwt'
import { config } from '../config/config'
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

export const successResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  status: true,
  data,
  message,
});

export const successResponseWithMeta = <T>(data: T, meta?: ApiResponse<T>['meta'], message?: string): ApiResponse<T> => ({
  status: true,
  data,
  meta,
  message,
});

export const errorResponse = <T>(error: string): ApiResponse<T> => ({
  status: false,
  error,
});

export const sanitizeUser = (user: any) => {
  const { password, ...sanitizedUser } = user
  return sanitizedUser
}
export const generateToken = async (
  user: any,
  fastify: any
): Promise<string> => {
  return fastify.jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    { expiresIn: config.jwtAccessExpiresIn }
  )
}