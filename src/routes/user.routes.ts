import { Router } from "express";
import { AddUser, deleteUser, forgotPassword, GetallUser, getUserAssignedProjects, getUserById, getUserPayments, loginUser, resetPassWord, searchUsers, updateUser } from "../controllers/user.controller";
import { addUserValidation } from "../middleware/user.Validation";
import { isAuth } from "../middleware/isAuth";

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and operations
 */

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: 
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users
 */
userRouter.get("/all", isAuth, GetallUser);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users by query
 *     tags: 
 *       - Users
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query to find users by username or email
 *     responses:
 *       200:
 *         description: A list of matching users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109ca"
 *                   username:
 *                     type: string
 *                     example: "Avishka Chanaka"
 *                   email:
 *                     type: string
 *                     example: "avishkachanaka@gmail.com"
 */
userRouter.get("/search", isAuth, searchUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a new user
 *     tags: 
 *       - Users
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
userRouter.post("/", isAuth, addUserValidation, AddUser);

/**
 * @swagger
 * /users/signIn:
 *   post:
 *     summary: Login user
 *     tags: 
 *       - Authentication
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
 *                 example: "123"
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
 *     tags: 
 *       - Authentication
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
userRouter.put("/resetPassword", resetPassWord);

/**
 * @swagger
 * /users/forgotPassword:
 *   post:
 *     summary: Forgot Password user 
 *     tags: 
 *       - Authentication
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
userRouter.post("/forgotPassword", forgotPassword);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: 
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Name"
 *               email:
 *                 type: string
 *                 example: "updatedemail@example.com"
 *               role:
 *                 type: string
 *                 example: "user"
 *               contactNumber:
 *                 type: string
 *                 example: "0777123456"
 *               workLocation:
 *                 type: string
 *                 example: "Office"
 *               startDate:
 *                 type: string
 *                 example: "2024-08-18"
 *               status:
 *                 type: string
 *                 example: "inactive"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
userRouter.put("/:id", isAuth, updateUser);
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: 
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.delete("/:id", isAuth, deleteUser);


/**
 * @swagger
 * /users/{userId}/paymentHistory:
 *   get:
 *     summary: Get payment details for a user
 *      tags: 
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved payment details
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.get('/:userId/paymentHistory',isAuth, getUserPayments);

/**
 * @swagger
 * /users/{userId}/assignedProjects:
 *   get:
 *     summary: Get assigned projects for a user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved assigned projects
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.get('/:userId/assignedProjects',isAuth, getUserAssignedProjects);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: 
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.get('/:id', getUserById);
export default userRouter;
