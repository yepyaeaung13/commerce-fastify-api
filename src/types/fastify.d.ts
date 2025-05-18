import 'fastify'
import { FastifyRequest, FastifyReply } from 'fastify'

import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWTNamespaceAccess {
    payload: { id: string; email: string }; // adjust to your payload
    user: { id: string; email: string };
  }

  interface FastifyJWTNamespaceRefresh {
    payload: { id: string; email: string }; // adjust to your payload
    user: { id: string; email: string };
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    accessJwtVerify(): Promise<void>;
    accessJwtDecode(): { [key: string]: any };
    accessUser: { [key: string]: any };

    refreshJwtVerify(): Promise<void>;
    refreshJwtDecode(): { [key: string]: any };
    refreshUser: { [key: string]: any };
  }

  interface FastifyReply {
    accessJwtSign(payload: object, options?: object): Promise<string>;
    refreshJwtSign(payload: object, options?: object): Promise<string>;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}