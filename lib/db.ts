import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || "";

declare global {
    var __dbPool: Pool | undefined;
}

const pool = global.__dbPool ?? new Pool({
    connectionString,
});

if (process.env.NODE_ENV !== "production") global.__dbPool = pool;

/**
 * Convert a snake_case string to camelCase.
 * Example: "user_id" → "userId", "first_name" → "firstName"
 */
const toCamelCase = (key: string): string =>
    key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

/**
 * Check if a value is a plain object (not Array, Date, or null).
 * This prevents accidentally destructuring Date objects or other non-plain objects.
 */
const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    value !== null && typeof value === "object" && !Array.isArray(value) && value.constructor === Object;

/**
 * Recursively convert all keys in an object/array from snake_case to camelCase.
 * Handles nested objects, arrays, and JSONB-parsed values.
 * Skips Date objects and other non-plain objects to avoid data corruption.
 */
const transformKeys = (value: unknown): unknown => {
    if (Array.isArray(value)) {
        return value.map(transformKeys);
    }

    if (isPlainObject(value)) {
        return Object.fromEntries(
            Object.entries(value).map(
                ([key, val]) => [toCamelCase(key), transformKeys(val)],
            ),
        );
    }

    return value;
};

/**
 * Wrapper around Pool.query that transforms all row property names
 * from snake_case (PostgreSQL convention) to camelCase (TypeScript convention).
 *
 * This replaces Prisma's auto-mapping of `user_id` → `userId`.
 */
const db = {
    query: async (text: string, params?: unknown[]) => {
        const result = await pool.query(text, params);
        return {
            ...result,
            rows: result.rows.map(transformKeys) as any[],
        };
    },
};

export default db;
