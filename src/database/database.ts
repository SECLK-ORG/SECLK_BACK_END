import logger from "../utils/logger";
import mongoose from "mongoose";
import { DB_CONNECTION_STRING } from "../configs/config";
import 'dotenv/config';

let db: typeof mongoose;

  export const connect= async () => {
    const MONGODB_URL = DB_CONNECTION_STRING || '';
    logger.info('Connecting to database ....');
    if (db) {
        return;
    }
    mongoose.set('strictQuery', true);
    mongoose.connect(MONGODB_URL).then((connection) => {
        db = connection;
        logger.info('Database connected !');
    }).catch((error) => {

        logger.error('Error connecting to database: ', error);
    });
}