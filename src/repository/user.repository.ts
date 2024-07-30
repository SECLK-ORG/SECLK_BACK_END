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
export const getAllUsers = async () => {
    try {
        const users = await userSchema.find();
        return users;
    } catch (error: any) {
        logger.error(`Error in getAllUsers: ${error.message}`);
        throw new Error(error.message);
    }
}
export const updateUserId = async (id: string, userData: any) => {
    try {
        const updatedUser = await userSchema.findOneAndUpdate({ _id: id }, userData, { new: true });
        return updatedUser;
    } catch (error: any) {
        logger.error(`Error in updateUser: ${error.message}`);
        throw new Error(error.message);
    }

}