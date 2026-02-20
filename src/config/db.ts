import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import prismaPkg from "@prisma/client";
import pg from "pg";

const { PrismaClient } = prismaPkg;

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("DB Connected via Prisma");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error("DB disconnect error:", error);
  }
};

export { prisma, connectDB, disconnectDB };