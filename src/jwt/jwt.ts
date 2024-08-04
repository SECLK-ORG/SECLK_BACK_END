import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/config';
import { BadRequestError, UnauthorizedError } from '../models/errors';

// Generate a generic token
export const generateToken = async (payload: any) => {
    return jwt.sign(payload, JWT_SECRET);
}

// Generate a forgot password token
export const generateForgotPasswordToken = async (payload: any) => {
    return jwt.sign({ email: payload.email }, JWT_SECRET, { expiresIn: '300s' });
}

// Generate an access token
export const generateAccessToken = async (payload: any) => {
    return jwt.sign({
        email: payload.email,
        userId: payload._id.toString(),
        role: payload.role,
        name: payload.name,
    }, JWT_SECRET, { expiresIn: '24h' });
}

// Validate a token
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
}
