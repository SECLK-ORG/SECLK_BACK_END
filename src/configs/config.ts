import 'dotenv/config';
export const DB_CONNECTION_STRING = process.env.MONGODB_URL;
export const JWT_SECRET = process.env.JWT_SECRET||"secret";
export const BACKEND_URL = process.env.BACKEND_URL||"http://localhost:3000";