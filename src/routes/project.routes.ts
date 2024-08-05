import { Router } from "express";
import { getAllProjects, createProject, getProjectStatusCount } from '../controllers/project.controller';
import { isAuth } from "../middleware/isAuth";

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
projectRouter.get('/all',isAuth, getAllProjects);

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
 *               projectName:
 *                 type: string
 *                 example: "New Project"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *               category:
 *                   type: string
 *                   example: "UK"
 *               status:
 *                   type: string
 *                   example: "Completed"
 *               clientContactNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               clientEmail:
 *                 type: string
 *                 format: email
 *                 example: "client@example.com"
 *               paymentType:
 *                 type: string
 *                 example: "Credit Card"
 *               createdBy:
 *                 type: string
 *                 example: "60c72b2f4f1a2c001c8e4f34"
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
 *                 projectName:
 *                   type: string
 *                   example: "New Project"
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-08-01"
 *                 endDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-12-31"
 *                 category:
 *                   type: string
 *                   example: "UK"
 *                 status:
 *                   type: string
 *                   example: "Completed"
 *                 clientContactNumber:
 *                   type: string
 *                   example: "+1234567890"
 *                 clientEmail:
 *                   type: string
 *                   format: email
 *                   example: "client@example.com"
 *                 paymentType:
 *                   type: string
 *                   example: "Credit Card"
 *                 createdBy:
 *                   type: string
 *                   example: "66aa422f704f28d4993c7d41"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-08-01T18:25:43.511Z"
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

projectRouter.post('/create',isAuth, createProject);

/**
 * @swagger
 * /projects/getProjectStatusCount:
 *   get:
 *     summary: Get project counts by status
 *     description: Retrieve the count of projects based on their status.
 *     responses:
 *       200:
 *         description: Projects fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 Completed:
 *                   type: integer
 *                   example: 40
 *                 InProgress:
 *                   type: integer
 *                   example: 50
 *                 OnHold:
 *                   type: integer
 *                   example: 10
 *       500:
 *         description: Internal server error
 */
projectRouter.get("/getProjectStatusCount",isAuth, getProjectStatusCount);

export default projectRouter;
