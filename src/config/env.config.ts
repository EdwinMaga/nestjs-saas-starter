export const env = {
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT) || 3000,

  databaseUrl: process.env.DATABASE_URL,

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
};
