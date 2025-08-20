const { z } = require('zod');
require('dotenv').config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGO_URL: z
    .string()
    .refine(
      (v) => v.startsWith('mongodb://') || v.startsWith('mongodb+srv://'),
      'Invalid Mongo URL'
    ),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET should be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  ALLOWED_ORIGINS: z
    .string()
    .optional()
    .transform((v) =>
      v
        ? v
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : []
    ),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid ENV configuration:');
  for (const error of parsed.error.issues) {
    console.error(`- ${error.path.join('.')}: ${error.message}`);
  }
  process.exit(1);
}

module.exports = parsed.data;
