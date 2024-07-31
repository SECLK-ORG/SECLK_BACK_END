import { Request, Response } from 'express';
import { user } from '../models/user.model';
import logger from '../utils/logger';
import { addUserService, getAllUsersService, loginUserService, ResetPasswordService } from '../services/user.services';
import { AppError, BadRequestError } from '../models/errors';
import { generateAccessToken } from '../jwt/jwt';
export const AddUser = async (req:Request, res:Response) => {
    try {
        const userData:user=req.body;
        userData.email=userData.email.toLowerCase()
      
        logger.info(`Received user data: ${JSON.stringify(userData)}`);
        const response= await addUserService(userData)

      
       res.status(response.code).send(response);
    } catch (error:any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}

export const GetallUser = async (req:Request, res:Response) => {
    try {
        const response= await getAllUsersService();
        res.status(response.code).send(response);
    } catch (error:any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}

export const loginUser=async(req:Request,res:Response)=>{
    try {
        const {email,password}=req.body;
    
        if(!email || !password){
            throw new BadRequestError('Email and Password are required')
        }
        const response:any= await loginUserService(email,password)
        
        res.status(response.code).send(response);
    } catch (error:any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}

export const resetPassWord=async (req:Request,res:Response)=>{
    try {
        const {email,password,token}=req.body;
        if(!email || !password){
            throw new BadRequestError('Email and Password are required')
        }
        console.log("token",token)
        const response= await ResetPasswordService(email,password,token)
        res.status(response.code).send(response);

    } catch (error:any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}
