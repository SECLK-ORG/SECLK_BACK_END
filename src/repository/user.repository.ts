import { user } from "../models/user.model";
import userSchema from '../database/models/user';
import logger from "../utils/logger";
import { EmployeePayloadDto } from "../models/common";
import { ConflictError } from "../models/errors";

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


export const searchUsersRepo = async (query: string) => {
    try {
        let users;
        if (query === ""||query===" ") {
            users = await userSchema.find({}, '_id name email position');
        } else {
            users = await userSchema.find(
                {
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { email: { $regex: query, $options: 'i' } }
                    ]
                },
                '_id name email position'
            );
        }
        return users;
    } catch (error: any) {
        logger.error(`Error in searchUsersRepo: ${error.message}`);
        throw new Error(error.message);
    }
}

export const updateUserId = async (id: string, userData: EmployeePayloadDto) => {
    try {
        logger.info(`Repository: Finding and updating user ID: ${id}`);

        const updatedUser = await userSchema.findOneAndUpdate({ _id: id }, userData, { new: true });

        if (updatedUser) {
            logger.info(`Repository: User updated successfully, ID: ${id}`);
        } else {
            logger.warn(`Repository: User not found, ID: ${id}`);
        }

        return updatedUser;
    } catch (error: any) {
        logger.error(`Repository: Error updating user, ID: ${id}`, error);
        throw new Error(error.message);
    }
};

export const deleteUserRepo = async (userId: string) => {
    try {
        logger.info(`Repository: deleteUserRepo - Checking if user with ID: ${userId} has assigned projects`);

        // Check if the user has any assigned projects
        const user = await userSchema.findById(userId);
        if (!user) {
            logger.warn(`Repository: deleteUserRepo - User with ID: ${userId} not found`);
            return null;
        }

        if (user.assignedProjects.length > 0) {
            logger.warn(`Repository: deleteUserRepo - User with ID: ${userId} has assigned projects. Aborting deletion.`);
            throw new ConflictError('User has assigned projects and cannot be deleted.');
        }

        logger.info(`Repository: deleteUserRepo - No assigned projects found for user with ID: ${userId}. Proceeding with deletion.`);

        const deletedUser = await userSchema.findByIdAndDelete(userId);

        if (deletedUser) {
            logger.info(`Repository: deleteUserRepo - User with ID: ${userId} deleted successfully`);
        } else {
            logger.warn(`Repository: deleteUserRepo - User with ID: ${userId} not found`);
        }

        return deletedUser;
    } catch (error: any) {
        logger.error(`Repository: deleteUserRepo - Error deleting user with ID: ${userId} - ${error.message}`);
        throw new Error(error.message);
    }
};