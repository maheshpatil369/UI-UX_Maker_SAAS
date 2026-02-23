// drizzle.config.ts
import "dotenv/config";

export default {
  schema: "./config/schema.tsx",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
};