import { Router } from "express";
import { AddUser, GetUser } from "../controllers/user.controller";
import { addUserValidation } from "../middleware/user.Validation";

const userRouter = Router();

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 */
userRouter.get("/", GetUser);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Add a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               position:
 *                 type: string
 *     responses:
 *       200:
 *         description: User added
 */
userRouter.post("/",addUserValidation,AddUser );


    
export default userRouter;