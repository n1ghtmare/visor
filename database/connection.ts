import { Pool, QueryConfig, types } from "pg";

// By default NUMERIC is returned as a string, because its value could overflow the length of JS int
types.setTypeParser(types.builtins.NUMERIC, function (value: string) {
    return parseFloat(value);
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function query<T>(input: string | QueryConfig, params?: any[]) {
    return pool.query<T>(input, params);
}
