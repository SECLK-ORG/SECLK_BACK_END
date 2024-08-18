import { Request, Response } from 'express';
import { user } from '../models/user.model';
import logger from '../utils/logger';
import { addUserService, deleteUserService, forgotPasswordService, getAllUsersService, loginUserService, ResetPasswordService, searchUsersService } from '../services/user.services';
import { AppError, BadRequestError } from '../models/errors';
import { EmployeePayloadDto } from '../models/common';
import { updateUserService } from '../services/project.services';

export const AddUser = async (req: Request, res: Response) => {
    try {
        const userData: user = req.body;
        userData.email = userData.email.toLowerCase();

        logger.info(`Controller: Received user data for creation: ${JSON.stringify(userData)}`);

        const response = await addUserService(userData);

        logger.info(`Controller: User created successfully with ID: ${response.data._id}`);

        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            logger.error(`Controller: ${error.message}`);
            res.status(error.statusCode).send({ message: error.message });
        } else {
            logger.error("Controller: Internal Server Error", error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
};

export const GetallUser = async (req: Request, res: Response) => {
    try {
        logger.info('Controller: Fetching all users');

        const response = await getAllUsersService();

        logger.info('Controller: Fetched all users successfully');

        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            logger.error(`Controller: ${error.message}`);
            res.status(error.statusCode).send({ message: error.message });
        } else {
            logger.error("Controller: Internal Server Error", error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            logger.warn('Controller: Email and password are required for login');
            throw new BadRequestError('Email and Password are required');
        }

        logger.info(`Controller: Logging in user with email: ${email}`);

        const response: any = await loginUserService(email, password);

        logger.info(`Controller: User logged in successfully, ID: ${response.data._id}`);

        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            logger.error(`Controller: ${error.message}`);
            res.status(error.statusCode).send({ message: error.message });
        } else {
            logger.error("Controller: Internal Server Error", error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
};

export const resetPassWord = async (req: Request, res: Response) => {
    try {
        const { email, password, token } = req.body;

        if (!email || !password) {
            logger.warn('Controller: Email and password are required for password reset');
            throw new BadRequestError('Email and Password are required');
        }

        logger.info(`Controller: Resetting password for user with email: ${email}`);

        const response = await ResetPasswordService(email, password, token);

        logger.info('Controller: Password reset successfully');

        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            logger.error(`Controller: ${error.message}`);
            res.status(error.statusCode).send({ message: error.message });
        } else {
            logger.error("Controller: Internal Server Error", error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            logger.warn('Controller: Email is required for forgot password');
            throw new BadRequestError('Email is required');
        }

        logger.info(`Controller: Processing forgot password for email: ${email}`);

        await forgotPasswordService(email);

        logger.info('Controller: Forgot password email sent successfully');

        res.status(200).send({ message: "Password reset link sent to your email" });
    } catch (error: any) {
        if (error instanceof AppError) {
            logger.error(`Controller: ${error.message}`);
            res.status(error.statusCode).send({ message: error.message });
        } else {
            logger.error("Controller: Internal Server Error", error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
};

export const searchUsers = async (req: Request, res: Response) => {
    try {
        let query = req.query.q as string;

        logger.info(`Controller: Searching users with query: ${query}`);

        if (!query) {
            query = "";
        }

        const response = await searchUsersService(query);

        logger.info('Controller: User search completed successfully');

        res.status(200).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            logger.error(`Controller: ${error.message}`);
            res.status(error.statusCode).send({ message: error.message });
        } else {
            logger.error("Controller: Internal Server Error", error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const userData: EmployeePayloadDto = req.body;

        logger.info(`Controller: Received update request for user ID: ${userId} with data: ${JSON.stringify(userData)}`);

        const response = await updateUserService(userId, userData);

        logger.info(`Controller: User updated successfully, ID: ${userId}`);

        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            logger.error(`Controller: ${error.message}`);
            res.status(error.statusCode).send({ message: error.message });
        } else {
            logger.error("Controller: Internal Server Error", error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
};
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        logger.info(`Controller: Received request to delete user with ID: ${userId}`);

        const response = await deleteUserService(userId);

        logger.info(`Controller: User deleted successfully, ID: ${userId}`);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            logger.error(`Controller: ${error.message}`);
            res.status(error.statusCode).send({ message: error.message });
        } else {
            logger.error("Controller: Internal Server Error", error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
};