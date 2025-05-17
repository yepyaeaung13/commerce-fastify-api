import { buildServer } from "./src/app";
import * as dotenv from "dotenv";
import closeWithGrace from "close-with-grace";

dotenv.config();

export type Options = {
    logger: boolean | { transport: { target: string}}
}

const opts: Options = {
    logger: true
}

if (process.stderr.isTTY)
{
    opts.logger = { transport: { target: 'pino-pretty' } };
} else
{
    opts.logger = true;
}

// Create and initialize the server
async function startServer() {
    const app = await buildServer(opts);

    const port = process.env.PORT || 3001;
    const host = process.env.HOST || '127.0.0.1';

    app.listen({ port: Number(port), host });

    closeWithGrace(async ({ signal, err }: { signal?: string;  err?: Error | null}) => {
        if (err)
        {
            app.log.error({ err }, 'server closing with error');
        } else
        {
            app.log.info(`${ signal } received, server closing`)
        }
    });
}

startServer().catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
});
