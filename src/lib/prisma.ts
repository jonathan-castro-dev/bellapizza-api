import { Client } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

const client = new Client(connectionString);
const adapter = new PrismaNeon(client);

export const prisma = new PrismaClient({ adapter });
