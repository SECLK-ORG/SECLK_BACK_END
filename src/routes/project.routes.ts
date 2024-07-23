import { Router } from "express";
import { getAllProjects, createProject } from '../controllers/project.controller';

const projectRouter = Router();

/**
 * @swagger
 * /projects/all:
 *   get:
 *     summary: Get all projects
 *     description: Retrieve a list of all projects.
 *     responses:
 *       200:
 *         description: A list of projects
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
 *                   name:
 *                     type: string
 *                     example: "Project Name"
 *                   description:
 *                     type: string
 *                     example: "Project Description"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2021-06-13T18:25:43.511Z"
 */
projectRouter.get('/all', getAllProjects);

/**
 * @swagger
 * /projects/create:
 *   post:
 *     summary: Create a new project
 *     description: Create a new project with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Project"
 *               description:
 *                 type: string
 *                 example: "Project Description"
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60c72b2f4f1a2c001c8e4f34"
 *                 name:
 *                   type: string
 *                   example: "New Project"
 *                 description:
 *                   type: string
 *                   example: "Project Description"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2021-06-13T18:25:43.511Z"
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
projectRouter.post('/create', createProject);

export default projectRouter;
