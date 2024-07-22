import { Request, Response } from 'express';
import { user } from '../models/user.model';

export const AddUser = async (req:Request, res:Response) => {
    try {
        const userData:user=req.body;
        console.log("userData",userData)
      
     
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