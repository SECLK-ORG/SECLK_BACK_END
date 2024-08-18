import { Router } from "express";
import { createCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/category.controller';
import { isAuth } from "../middleware/isAuth";

const categoryRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API endpoints for managing categories
 */

/**
 * @swagger
 * /categories/all:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all categories.
 *     tags: 
 *       - Categories
 *     responses:
 *       200:
 *         description: A list of categories
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
 *                   category:
 *                     type: string
 *                     example: "UK"
 */
categoryRouter.get('/all', isAuth, getAllCategories);

/**
 * @swagger
 * /categories/create:
 *   post:
 *     summary: Create a new category
 *     description: Create a new category with the provided details.
 *     tags: 
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: "UK"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60c72b2f4f1a2c001c8e4f34"
 *                 category:
 *                   type: string
 *                   example: "UK"
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
categoryRouter.post('/create', isAuth, createCategory);

/**
 * @swagger
 * /categories/update/{id}:
 *   put:
 *     summary: Update an existing category
 *     description: Update a category with the provided details.
 *     tags: 
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: "Updated Category"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60c72b2f4f1a2c001c8e4f34"
 *                 category:
 *                   type: string
 *                   example: "Updated Category"
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
categoryRouter.put('/update/:id', isAuth, updateCategory);

/**
 * @swagger
 * /categories/delete/{id}:
 *   delete:
 *     summary: Delete a category
 *     description: Delete a category by ID.
 *     tags: 
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category deleted successfully"
 *       500:
 *         description: Internal server error
 */
categoryRouter.delete('/delete/:id', isAuth, deleteCategory);

export default categoryRouter;
