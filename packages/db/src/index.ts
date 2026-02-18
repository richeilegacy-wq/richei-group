import { env } from "@richei-group/env/server";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

export const db = drizzle(env.DATABASE_URL, { schema });

// Re-export drizzle-orm so consumers use the same copy of drizzle types
export * from "drizzle-orm";
