import { PrismaClient } from "../../generated/prisma";
import { databaseConfig } from "../config/database.config";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient(
    {
        datasources: {
            db: {
                url: databaseConfig.DATABASE_URL,
            }
        },
        log: process.env.NODE_ENV === 'development' ?
        ['query', 'info', 'warn', 'error'] : ['error']
    }
);

if(process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function connect() {
    try {
        await prisma.$connect();
        console.log("Database connected successfully.");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}