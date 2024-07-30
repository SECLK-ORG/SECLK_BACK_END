import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/config';

export const generateToken = async(payload: any) => {
    return jwt.sign(payload,JWT_SECRET);
}
