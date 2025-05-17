export type Options = {
    logger: boolean | {
        transport: {
            target: string;
        };
    };
};
