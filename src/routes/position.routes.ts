import { Router } from "express";
import { createPosition, getAllPositions, updatePosition, deletePosition } from '../controllers/position.controller';
import { isAuth } from "../middleware/isAuth";

const positionRouter = Router();

/**
 * @swagger
 * /positions/all:
 *   get:
 *     summary: Get all positions
 *     description: Retrieve a list of all positions.
 *     responses:
 *       200:
 *         description: A list of positions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "60c72b2f4f1a2c001c8e4f34"
 *                   positions:
 *                     type: string
 *                     example: "Manager"
 */
positionRouter.get('/all', isAuth, getAllPositions);

/**
 * @swagger
 * /positions/create:
 *   post:
 *     summary: Create a new position
 *     description: Create a new position with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               positions:
 *                 type: string
 *                 example: "Manager"
 *     responses:
 *       201:
 *         description: Position created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60c72b2f4f1a2c001c8e4f34"
 *                 positions:
 *                   type: string
 *                   example: "Manager"
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
positionRouter.post('/create', isAuth, createPosition);

/**
 * @swagger
 * /positions/update/{id}:
 *   put:
 *     summary: Update an existing position
 *     description: Update a position with the provided details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The position ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               positions:
 *                 type: string
 *                 example: "Updated Position"
 *     responses:
 *       200:
 *         description: Position updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60c72b2f4f1a2c001c8e4f34"
 *                 positions:
 *                   type: string
 *                   example: "Updated Position"
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
positionRouter.put('/update/:id', isAuth, updatePosition);

/**
 * @swagger
 * /positions/delete/{id}:
 *   delete:
 *     summary: Delete a position
 *     description: Delete a position by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The position ID
 *     responses:
 *       200:
 *         description: Position deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Position deleted successfully"
 *       500:
 *         description: Internal server error
 */
positionRouter.delete('/delete/:id', isAuth, deletePosition);

export default positionRouter;
