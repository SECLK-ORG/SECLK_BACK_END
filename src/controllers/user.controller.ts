import { Request, Response } from 'express';
import { user } from '../models/user.model';
import logger from '../utils/logger';
import { addUserService } from '../services/user.services';

export const AddUser = async (req:Request, res:Response) => {
    try {
        const userData:user=req.body;
        userData.email=userData.email.toLowerCase()
        logger.info(`Received user data: ${JSON.stringify(userData)}`);
         const response= await addUserService(userData)
      
       res.status(response.code).send(response);
    } catch (error:any) {
        res.status(400).send(error.message);
    }
}

export const GetUser = async (req:Request, res:Response) => {
    try {
        res.send("User Fetched");
    } catch (error:any) {
        res.status(400).send(error.message);
    }
}