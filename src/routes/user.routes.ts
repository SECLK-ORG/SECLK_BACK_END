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

userRouter.post("/",addUserValidation,AddUser );


    
export default userRouter;