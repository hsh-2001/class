import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/prisma/generated/client";

const connectionString = `${process.env.DATABASE_URL}`;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

export default prisma;
