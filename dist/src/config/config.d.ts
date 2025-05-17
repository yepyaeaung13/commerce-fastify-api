export declare const config: {
    port: string | undefined;
    jwtSecret: string | undefined;
    database: {
        url: string | undefined;
    };
    cors: {
        origin: string | undefined;
        credentials: boolean;
    };
    pagination: {
        defaultLimit: number;
        maxLimit: number;
    };
};
