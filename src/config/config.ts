import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
    dotenv.config({ path: ".env" });
} else {
    dotenv.config({ path: ".env.example" });
}

export const APP_NAME: string = process.env.APP_NAME || 'app-dev';
export const APP_VERSION: string = process.env.APP_VERSION;
export const APP_DEBUG: boolean = Boolean(process.env.APP_DEBUG) || false;
export const APP_ENV: string = process.env.APP_ENV || "local";
export const APP_PORT: number = parseInt(process.env.APP_PORT) || 4000;
export const APP_CODE: string = process.env.APP_CODE;
export const APP_SECRET: string = process.env.APP_SECRET;
export const DB_HOST: string = process.env.DB_HOST;
export const DB_USERNAME: string = process.env.DB_USERNAME;
export const DB_PASSWORD: string = process.env.DB_PASSWORD;
export const DB_NAME: string = process.env.DB_NAME;
export const DB_PORT: number = parseInt(process.env.DB_PORT);
export const DB_LOG: boolean = Boolean(process.env.DB_LOG) || false;
export const ORIGIN: string = process.env.ORIGIN || 'http://localhost:3000,http://localhost:5173,http://www.bisikberbisik.com,https://www.bisikberbisik.com';
export const GC_PROJECT_ID: string = process.env.GC_PROJECT_ID || '';
export const GC_BUCKET_NAME: string = process.env.GC_BUCKET_NAME || '';
export const GC_FILE_TIME: number = parseInt(process.env.GC_FILE_TIME) || 1;
export const GCS_SA: string = process.env.GCS_SA || 'gcs.json';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '15m';
export const SALT_ROUNDS: number = parseInt(process.env.SALT_ROUNDS) || 10;