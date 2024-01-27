declare class EnvironmentVariables {
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    AWS_ACCESS_KEY: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_S3_BUCKET_NAME: string;
    AWS_REGION: string;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
export {};
