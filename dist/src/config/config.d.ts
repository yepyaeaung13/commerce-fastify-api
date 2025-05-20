export declare const config: {
    port: string | undefined;
    jwtAccessSecret: string;
    jwtRefreshSecret: string;
    jwtAccessExpiresIn: string;
    jwtRefreshExpiresIn: string;
    database: {
        url: string | undefined;
    };
    cors: {
        origin: boolean;
        credentials: boolean;
    };
    pagination: {
        defaultLimit: number;
        maxLimit: number;
    };
};
