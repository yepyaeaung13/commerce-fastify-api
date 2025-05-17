import dotenv from 'dotenv'
dotenv.config()

export const config = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  database: {
    url: process.env.DATABASE_URL,
  },
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 100
  }
}