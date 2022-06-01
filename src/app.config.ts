export default () => ({
  app: {
    port: parseInt(process.env.PORT, 10) || '5000',
    baseUrl: process.env.BASE_URL || 'http://localhost:5000', // Match default port
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  },
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET || 'not_so_secret',
      alg: 'HS512',
      expiration: 1 * 60 * 60, // 1 hour
      issuer: process.env.JWT_ISSUER || 'elykp-tweeter.ml',
    },
    salt_rounds: 10,
    email_verification_expiration: 24 * 60 * 60, // 24 hours
    refresh_token_expiration: 30 * 24 * 60 * 60, // 1 month
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    message_ttl: 1 * 60 * 60 + 5 * 60, // 1 hour + 5 minutes
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '040799',
    name: process.env.DB_NAME || 'ceberus',
  },
});
