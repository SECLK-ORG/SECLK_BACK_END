import { user } from "../models/user.model";
import { findUserByEmail, createUser, getAllUsers, updateUserId } from "../repository/user.repository";
import logger from "../utils/logger";
import { responseFormate } from "../models/response";
import bcrypt from 'bcrypt';
import { sendEmail } from "./email.services";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../models/errors";
import { generateToken } from "../jwt/jwt";

export const addUserService = async (userData: user) => {
    logger.info(`addUserServiceRequest userData = ${JSON.stringify(userData)}`);
    const tempPassword= await createTempPassword();
    const hashedPassword= await bcrypt.hash(tempPassword,10);
    userData.password=hashedPassword;
    const existingUser = await findUserByEmail(userData.email);
    const  resetToken=await generateToken({email:userData.email,password:tempPassword});
    userData.pwResetToken=resetToken;
    if (existingUser) {
        throw new BadRequestError("user Already Eexist")
    }
    const data:any = await createUser(userData);

 
    // await updateUserId(data._id,{pwResetToken:resetToken});
    await sendEmail(userData.email, 'Welcome to SE Consultant', resetToken,userData.name);

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


export const getAllUsersService=async()=>{
    try {
        const users = await getAllUsers();
        const response: responseFormate = {
            code: 200,
            data: users,
            message: "Users Fetched"
        };
        return response;
    } catch (error: any) {
        logger.error(`Error in getAllUsersService: ${error.message}`);
        throw new Error(error.message);
    
    }

}


const createTempPassword= async()=>{
    return Math.random().toString(36).slice(-8);
}
