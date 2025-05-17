"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
const dotenv = __importStar(require("dotenv"));
const close_with_grace_1 = __importDefault(require("close-with-grace"));
dotenv.config();
const opts = {
    logger: true
};
if (process.stderr.isTTY) {
    opts.logger = { transport: { target: 'pino-pretty' } };
}
else {
    opts.logger = true;
}
// Create and initialize the server
async function startServer() {
    const app = await (0, app_1.buildServer)(opts);
    const port = process.env.PORT || 3001;
    const host = process.env.HOST || '127.0.0.1';
    app.listen({ port: Number(port), host });
    (0, close_with_grace_1.default)(async ({ signal, err }) => {
        if (err) {
            app.log.error({ err }, 'server closing with error');
        }
        else {
            app.log.info(`${signal} received, server closing`);
        }
    });
}
startServer().catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map