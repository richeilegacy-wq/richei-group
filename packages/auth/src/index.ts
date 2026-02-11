import { db } from "@richei-group/db";
import * as schema from "@richei-group/db/schema/auth";
import { env } from "@richei-group/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",

    schema: schema,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      // TODO: enable httpOnly when we have a proper domain
      // secure: true,
      // httpOnly: true,
    },
  },
  plugins: [],
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "USER",
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  rateLimit: {
    customRules: {
      "/forget-password": { window: 10, max: 3 },
      "/sign-up": {
        window: 10,
        max: 3,
      },
    },
  },
  logger: {
    level: "debug",
    log(level, message, ...args) {
      console.log(level, message, ...args);
    },
  },
});
