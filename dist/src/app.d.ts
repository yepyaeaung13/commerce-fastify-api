import { type TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Options } from "../server";
export declare function buildServer(options: Options): Promise<import("fastify").FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").FastifyBaseLogger, TypeBoxTypeProvider>>;
