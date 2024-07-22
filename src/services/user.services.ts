import { user } from "../models/user.model";
import { findUserByEmail, createUser } from "../repository/user.repository";
import logger from "../utils/logger";
import { responseFormate } from "../models/response";

export const addUserService = async (userData: user) => {
    logger.info(`addUserServiceRequest userData = ${JSON.stringify(userData)}`);
    
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
        throw new Error("user Already Eexist")
    }
    
    const data = await createUser(userData);
    const response: responseFormate = {
        code: 201,
        data: data,
        message: "User Created"
    };
    return response;
}
