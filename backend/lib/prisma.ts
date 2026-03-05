import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("ERRO: A variável DATABASE_URL não foi encontrada no .env");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });