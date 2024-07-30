import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/config';
import { BadRequestError, UnauthorizedError } from '../models/errors';

export const generateToken = async(payload: any) => {
    // return jwt.sign(payload,JWT_SECRET,{expiresIn:'1s'});
    return jwt.sign(payload,JWT_SECRET);

}

export const validateToken = async (token: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    reject(new UnauthorizedError('Token has expired'));
                } else if (err.name === 'JsonWebTokenError') {
                    reject(new UnauthorizedError('Invalid Token'));
                } else {
                    reject(new UnauthorizedError('Token verification failed'));
                }
            } else {
                resolve();
            }
        });
    });
};