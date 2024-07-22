import { user } from "../models/user.model"
import logger from "../utils/logger"

export const addUserService=(userData:user)=>{
    logger.info("userServices.addUserService userData:{}",userData)

}