import { FastifyRequest, FastifyReply } from 'fastify'
import { UserService } from '../services/user.service'
import { createPagination, errorResponse, hashPassword, successResponse, successResponseWithMeta } from '../utils/helpers'
import { UserInfoResponse } from '../types'
import { config } from '../config/config'

const userService = new UserService()

export async function getUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const pagination = createPagination(request.query as any)
    const result = await userService.findAll(pagination)
    
    return reply.send(successResponseWithMeta(result.data, {
      page: pagination.page,
      limit: pagination.take,
      total: result.total
    }, 'Users retrieved successfully'))
  } catch (error: any) {
    return reply.status(500).send(errorResponse(error?.message || 'Internal server error'))
  }
}

export async function getUserById(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    const user = await userService.findById(id)
    
    if (!user) {
      return reply.status(404).send(errorResponse('User not found'))
    }
    
    return reply.send(successResponse(user, 'User retrieved successfully'))
  } catch (error: any) {
    return reply.status(500).send(errorResponse(error?.message || 'Internal server error'))
  }
}

export async function loginUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, password } = request.body as { email: string; password: string }
    const user = await userService.login(email, password)
    
    if (!user) {
      return reply.status(401).send(errorResponse('Invalid credentials'))
    }

    // Assuming you have a method to generate a JWT token
    const accessToken = await reply.accessJwtSign(
      { id: user.id, email: user.email },
      { expiresIn: config.jwtAccessExpiresIn } 
    )

    const refreshToken = await reply.refreshJwtSign(
      { id: user.id, email: user.email },
      { expiresIn: config.jwtRefreshExpiresIn } 
    )

    const userInfo: UserInfoResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
    
    return reply.send(successResponse({ userInfo, accessToken, refreshToken }, 'Login successful'))
  } catch (error: any) {
    return reply.status(500).send(errorResponse( error?.message || 'Internal server error'))
  }
  
}

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userData = request.body as any
    const hashedPassword = await hashPassword(userData.password);
    userData.password = hashedPassword;
    const user = await userService.create(userData)

    const accessToken = await reply.accessJwtSign(
      { id: user.id, email: user.email },
      { expiresIn: config.jwtAccessExpiresIn } 
    )

    const refreshToken = await reply.refreshJwtSign(
      { id: user.id, email: user.email },
      { expiresIn: config.jwtRefreshExpiresIn } 
    )

    const userInfo: UserInfoResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }

    return reply.send(successResponse({ userInfo, accessToken, refreshToken }, 'User created successfully'))
  } catch (error: any) {
    return reply.status(500).send(errorResponse(error?.message || 'Internal server error'))
  }
}

export async function refreshAccessToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Verify the refresh token from the request headers or body (depending on your design)
    await request.refreshJwtVerify();

    // Extract user info from refresh token
    const user = request.refreshUser;

    if (!user) {
      return reply.status(401).send(errorResponse('Invalid refresh token'));
    }

    // Sign a new access token (shorter expiry)
    const newAccessToken = await reply.accessJwtSign(
      { id: user.id, email: user.email },
      { expiresIn: config.jwtAccessExpiresIn }
    );

    return reply.send(successResponse({ accessToken: newAccessToken }, 'New access token issued'));
  } catch (error: any) {
    return reply.status(401).send(errorResponse(error.message || 'Invalid or expired refresh token'));
  }
}


export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    const userData = request.body as any
    
    const user = await userService.update(id, userData)
    return reply.send(successResponse(user, 'User updated successfully'))
  } catch (error: any) {
    return reply.status(500).send(errorResponse(error?.message || 'Internal server error'))
  }
}

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string }
    await userService.delete(id)
    return reply.send(successResponse(null, 'User deleted successfully'))
  } catch (error: any) {
    return reply.status(500).send(errorResponse(error?.message || 'Internal server error'))
  }
}
