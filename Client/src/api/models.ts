export class ApiError extends Error {
    constructor(
        public status: number,
        public statusMessage: string,
        public serverMessages: string[]
    ) {
        super();
    }
}

export type Result<TVal, TErr> = {
    hasError: true;
    err: TErr
} | {
    hasError: false;
    value: TVal;
}

export const apiResultWrapper = {
    async execute<TResult>(func: () => Promise<TResult>): Promise<Result<TResult, ApiError>> {
        try {
            const result = await func();
            return { hasError: false, value: result };
        } catch (err) {
            if (err instanceof ApiError) {
                return { hasError: true, err };
            }
            return { hasError: true, err: new ApiError(500, "UnknownError", []) };
        }
    }
}