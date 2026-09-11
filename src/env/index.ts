import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['dev', 'test', 'production'])
    .default('dev'),

  PORT: z.coerce
    .number()
    .default(3333),

  FRONTEND_LOCAL_URL: z.string(),
  FRONTEND_CLIENT_PROD_URL: z.string(),
  FRONTEND_ADMIN_PROD_URL: z.string(),
    
  DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
