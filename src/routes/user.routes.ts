import { Router } from "express";
import { AddUser, GetallUser,loginUser, resetPassWord } from "../controllers/user.controller";
import { addUserValidation } from "../middleware/user.Validation";
import {isAuth} from "../middleware/isAuth";

const userRouter = Router();

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 */
userRouter.get("/all",isAuth, GetallUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Avishka Chanaka"
 *               email:
 *                 type: string
 *                 example: "avishkachanaka@gmail.com"
 *               role:
 *                 type: string
 *                 example: "admin"
 *               contactNumber:
 *                 type: string
 *                 example: "0715515546"
 *               workLocation:
 *                 type: string
 *                 example: "Home"
 *               startDate:
 *                 type: string
 *                 example: "2024-07-29"
 *               status:
 *                 type: string
 *                 example: "active"
 *     responses:
 *       201:
 *         description: User added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Avishka Chanaka"
 *                     email:
 *                       type: string
 *                       example: "avishkachanaka@gmail.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *                     contactNumber:
 *                       type: string
 *                       example: "0715515546"
 *                     workLocation:
 *                       type: string
 *                       example: "Home"
 *                     startDate:
 *                       type: string
 *                       example: "2024-07-29"
 *                     status:
 *                       type: string
 *                       example: "active"
 *                 message:
 *                   type: string
 *                   example: "User Created"
 */

userRouter.post("/",isAuth,addUserValidation,AddUser );
/**
 * @swagger
 * /users/signIn:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "avishkachanaka@gmail.com"
 *               password:
 *                 type: string
 *                 example: "hyteva3d"
 *     responses:
 *       200:
 *         description: User login successful
 *       401:
 *         description: Unauthorized, invalid credentials
 *       500:
 *         description: Internal server error
 */
userRouter.post("/signIn", loginUser);


/**
 * @swagger
 * /users/resetPassword:
 *   put:
 *     summary: Reset user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "avishkachanaka@gmail.com"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF2aXNoa2FjaGFuYWthQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoieXg3Ymtkd3ciLCJpYXQiOjE3MjIzNDM2NTR9.gqfptq83XvSPxMvlL43T8Q7hIjpeB4EwmUUVhMgDu40"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Bad Request, missing email or password
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Internal server error
 */
userRouter.put("/resetPassword",resetPassWord);



    
export default userRouter;