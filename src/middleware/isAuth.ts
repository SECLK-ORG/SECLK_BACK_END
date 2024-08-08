import  Jwt from "jsonwebtoken";
import {  UnauthorizedError,TokenExpiredError } from '../models/errors';
import { Request,Response ,NextFunction} from "express";
import { JWT_SECRET } from "../configs/config";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        throw new UnauthorizedError('Not Authenticated');
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = Jwt.verify(token, JWT_SECRET);

    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            throw new TokenExpiredError('Token has expired');
        } else {
            throw new UnauthorizedError('Not Authenticated');
        }
    }

    if (!decodedToken) {
        throw new UnauthorizedError('Not Authenticated');
    }
    next();
}   

