import { user } from "../models/user.model";
import { findUserByEmail, createUser, getAllUsers, updateUserId } from "../repository/user.repository";
import logger from "../utils/logger";
import { responseFormate } from "../models/response";
import bcrypt from 'bcrypt';
import { sendEmail } from "./email.services";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../models/errors";
import { generateAccessToken, generateToken, validateToken } from "../jwt/jwt";

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
    const user:any = await findUserByEmail(email);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new UnauthorizedError("Invalid Password");
    }
   const accessToken= await generateAccessToken(user);
  if(accessToken === undefined || accessToken === null){
        throw new BadRequestError("Token Generation Failed")
     }
    const response: responseFormate = {
        code: 200,
        data: accessToken,
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

export const  ResetPasswordService=async(email:string,password:string,token:string)=>{
    const user:any = await findUserByEmail(email);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    if(user.pwResetToken!==token){
        throw new UnauthorizedError("Token is invalid please try again");
    }
    await validateToken(token)
    const hashedPassword= await bcrypt.hash(password,10);

    const updatedUser = await updateUserId(user._id, { password: hashedPassword ,pwResetToken:null });
    const response: responseFormate = {
        code: 200,
        data: updatedUser,
        message: "Password Reset Success"
    };
    return response;
}
const createTempPassword= async()=>{
    return Math.random().toString(36).slice(-8);
}

