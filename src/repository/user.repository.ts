import { user } from "../models/user.model";
import userSchema from '../database/models/user';
import logger from "../utils/logger";

export const createUser = async (userData: user) => {
    try {
        const newUser = await userSchema.create(userData);
        return newUser;
    } catch (error: any) {
        logger.error(`Error in createUser: ${error.message}`);
        throw new Error(error.message);
    }
}

export const findUserByEmail = async (email: string) => {
    try {
        logger.info(`findUserByEmail - ${email.toLowerCase()}`);
        const user = await userSchema.findOne({ email: email.toLowerCase() });
        logger.info(`findUserByEmail user - ${user}`);
        return user;
    } catch (error: any) {
        logger.error(`Error in findUserByEmail: ${error.message}`);
        throw new Error(error.message);
    }
}
