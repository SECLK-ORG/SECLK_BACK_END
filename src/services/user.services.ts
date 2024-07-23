import { user } from "../models/user.model";
import { findUserByEmail, createUser } from "../repository/user.repository";
import logger from "../utils/logger";
import { responseFormate } from "../models/response";
import bcrypt from 'bcrypt';
import { sendEmail } from "./email.services";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../models/errors";

export const addUserService = async (userData: user) => {
    logger.info(`addUserServiceRequest userData = ${JSON.stringify(userData)}`);
    const tempPassword= await createTempPassword();
    const hashedPassword= await bcrypt.hash(tempPassword,10);
    userData.password=hashedPassword;

    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
        throw new BadRequestError("user Already Eexist")
    }
    const data = await createUser(userData);
    await sendEmail(userData.email, 'Welcome to SE Consultant', tempPassword,userData.name);

    const response: responseFormate = {
        code: 201,
        data: data,
        message: "User Created"
    };
    return response;
}


export const loginUserService = async (email: string, password: string) => {
    logger.info(`loginUserServiceRequest email = ${email}`);
    const user = await findUserByEmail(email);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new UnauthorizedError("Invalid Password");
    }
    const response: responseFormate = {
        code: 200,
        data: user,
        message: "Login Success"
    };
    return response;
}


const createTempPassword= async()=>{
    return Math.random().toString(36).slice(-8);
}