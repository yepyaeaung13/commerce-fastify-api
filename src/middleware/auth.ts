import { FastifyReply, FastifyRequest } from 'fastify'
import { verify } from 'jsonwebtoken'
import { JWTPayload } from '../types'
import { config } from '../config/config';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      return reply.status(401).send({ error: 'No token provided' })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verify(token, config.jwtSecret!) as JWTPayload
    request.user = decoded

  } catch (error) {
    reply.status(401).send({ error: 'Invalid token' })
  }
}