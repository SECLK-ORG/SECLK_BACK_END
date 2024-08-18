import { user } from "../models/user.model";
import { findUserByEmail, createUser, getAllUsers, updateUserId, searchUsersRepo, deleteUserRepo } from "../repository/user.repository";
import logger from "../utils/logger";
import { responseFormate } from "../models/response";
import bcrypt from 'bcrypt';
import { sendEmail } from "./email.services";
import { AppError, BadRequestError, NotFoundError, UnauthorizedError } from "../models/errors";
import { generateAccessToken, generateForgotPasswordToken, generateToken, validateToken } from "../jwt/jwt";

export const addUserService = async (userData: user) => {
    logger.info(`Service: addUserService - Received request to add user with data: ${JSON.stringify(userData)}`);
    
    const tempPassword = await createTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    userData.password = hashedPassword;
    
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
        logger.warn(`Service: addUserService - User with email ${userData.email} already exists`);
        throw new BadRequestError("User already exists");
    }

    const resetToken = await generateToken({ email: userData.email, password: tempPassword });
    userData.pwResetToken = resetToken;

    const data: any = await createUser(userData);
    logger.info(`Service: addUserService - User created successfully with ID: ${data._id}`);

    await sendEmail(userData.email, 'Welcome to SE Consultant', resetToken, userData.name, 'welcome.ejs');
    logger.info(`Service: addUserService - Welcome email sent to ${userData.email}`);

    const response: responseFormate = {
        code: 201,
        data: data,
        message: "User Created"
    };
    return response;
}

export const loginUserService = async (email: string, password: string) => {
    logger.info(`Service: loginUserService - Attempting login for email: ${email}`);
    
    const user: any = await findUserByEmail(email);
    if (!user) {
        logger.warn(`Service: loginUserService - User with email ${email} not found`);
        throw new NotFoundError("User not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        logger.warn(`Service: loginUserService - Invalid password for email: ${email}`);
        throw new UnauthorizedError("Invalid Password");
    }

    const accessToken = await generateAccessToken(user);
    if (!accessToken) {
        logger.error(`Service: loginUserService - Token generation failed for email: ${email}`);
        throw new BadRequestError("Token generation failed");
    }

    logger.info(`Service: loginUserService - User logged in successfully with email: ${email}`);

    const response: responseFormate = {
        code: 200,
        data: accessToken,
        message: "Login Success"
    };
    return response;
}

export const getAllUsersService = async () => {
    try {
        logger.info('Service: getAllUsersService - Fetching all users');
        
        const users = await getAllUsers();

        logger.info('Service: getAllUsersService - Successfully fetched all users');
        
        const response: responseFormate = {
            code: 200,
            data: users,
            message: "Users Fetched"
        };
        return response;
    } catch (error: any) {
        logger.error(`Service: getAllUsersService - Error: ${error.message}`);
        throw new Error(error.message);
    }
}

export const ResetPasswordService = async (email: string, password: string, token: string) => {
    logger.info(`Service: ResetPasswordService - Resetting password for email: ${email}`);
    
    const user: any = await findUserByEmail(email);
    if (!user) {
        logger.warn(`Service: ResetPasswordService - User with email ${email} not found`);
        throw new NotFoundError("User not found");
    }

    if (user.pwResetToken !== token) {
        logger.warn(`Service: ResetPasswordService - Invalid reset token for email: ${email}`);
        throw new UnauthorizedError("Invalid token, please try again");
    }

    await validateToken(token);

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await updateUserId(user._id, { password: hashedPassword, pwResetToken: null });

    logger.info(`Service: ResetPasswordService - Password reset successful for email: ${email}`);

    const response: responseFormate = {
        code: 200,
        data: updatedUser,
        message: "Password Reset Success"
    };
    return response;
}

export const forgotPasswordService = async (email: string) => {
    logger.info(`Service: forgotPasswordService - Initiating forgot password for email: ${email}`);
    
    const user: any = await findUserByEmail(email);
    if (!user) {
        logger.warn(`Service: forgotPasswordService - User with email ${email} not found`);
        throw new NotFoundError("User not found");
    }

    try {
        const resetToken = await generateForgotPasswordToken({ email: email });
        logger.info(`Service: forgotPasswordService - Generated reset token for email: ${email}`);

        const updatedUser = await updateUserId(user._id, { pwResetToken: resetToken });
        await sendEmail(email, 'Password Reset', resetToken, user.name, 'reset.ejs');

        logger.info(`Service: forgotPasswordService - Password reset email sent to ${email}`);

        const response: responseFormate = {
            code: 200,
            data: updatedUser,
            message: "Password Reset Success"
        };
        return response;
    } catch (error: any) {
        logger.error(`Service: forgotPasswordService - Error: ${error.message}`);
        throw new Error(error.message);
    }
}

export const searchUsersService = async (query: string) => {
    try {
        logger.info(`Service: searchUsersService - Searching users with query: ${query}`);
        
        const users = await searchUsersRepo(query);

        logger.info('Service: searchUsersService - Successfully fetched users matching the query');

        const response: responseFormate = {
            code: 200,
            data: users,
            message: "Users Fetched"
        };
        return response;
    } catch (error: any) {
        logger.error(`Service: searchUsersService - Error: ${error.message}`);
        throw new Error(error.message);
    }
}

const createTempPassword = async () => {
    return Math.random().toString(36).slice(-8);
}
export const deleteUserService = async (userId: string) => {
    logger.info(`Service: deleteUserService - Attempting to delete user with ID: ${userId}`);
    try {
        const deletedUser = await deleteUserRepo(userId);

        if (!deletedUser) {
            logger.warn(`Service: deleteUserService - User with ID ${userId} not found`);
            throw new NotFoundError("User not found");
        }
    
        logger.info(`Service: deleteUserService - User with ID ${userId} deleted successfully`);
    
        const response: responseFormate = {
            code: 200,
            data: deletedUser,
            message: "User Deleted Successfully"
        };
        return response;
        
    } catch (error:any) {
        throw new AppError(error, 400);
    }
}