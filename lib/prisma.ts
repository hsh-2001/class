import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/prisma/generated/client";

const connectionString = process.env.DATABASE_URL || "";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
  log: ["query", "warn", "error"],
});

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;