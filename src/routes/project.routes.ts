import { Router } from "express";
import { getAllProjects, createProject, getProjectStatusCount, updateProject, deleteProject, getProjectById, getEmployeeDetails, getExpenseDetails, getIncomeDetails } from '../controllers/project.controller';
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
projectRouter.get('/all', isAuth, getAllProjects);

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
 *                 type: string
 *                 example: "UK"
 *               status:
 *                 type: string
 *                 example: "Completed"
 *               clientContactNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               clientEmail:
 *                 type: string
 *                 format: email
 *                 example: "client@example.com"
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
 *                 createdBy:
 *                   type: string
 *                   example: "60c72b2f4f1a2c001c8e4f34"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-08-01T18:25:43.511Z"
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
projectRouter.post('/create', isAuth, createProject);

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
projectRouter.get('/getProjectStatusCount', isAuth, getProjectStatusCount);

/**
 * @swagger
 * /projects/project/{id}/incomeDetails:
 *   get:
 *     summary: Get income details by project ID
 *     description: Retrieve the income details associated with a specific project.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The project ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Income details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 incomeDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-08-01"
 *                       amount:
 *                         type: number
 *                         example: 1000
 *                       description:
 *                         type: string
 *                         example: "Income description"
 *                       source:
 *                         type: string
 *                         example: "Income source"
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
projectRouter.get('/project/:id/incomeDetails', isAuth, getIncomeDetails);

/**
 * @swagger
 * /projects/project/{id}/expenseDetails:
 *   get:
 *     summary: Get expense details by project ID
 *     description: Retrieve the expense details associated with a specific project.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The project ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 expenseDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-08-01"
 *                       amount:
 *                         type: number
 *                         example: 500
 *                       description:
 *                         type: string
 *                         example: "Expense description"
 *                       vendor:
 *                         type: string
 *                         example: "Vendor name"
 *                       invoiceNumber:
 *                         type: string
 *                         example: "INV123456"
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
projectRouter.get('/project/:id/expenseDetails', isAuth, getExpenseDetails);

/**
 * @swagger
 * /projects/project/{id}/employeeDetails:
 *   get:
 *     summary: Get employee details by project ID
 *     description: Retrieve the employee details associated with a specific project.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The project ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employees:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: string
 *                         example: "60c72b2f4f1a2c001c8e4f34"
 *                       employeeName:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "johndoe@example.com"
 *                       employeeID:
 *                         type: string
 *                         example: "EMP123456"
 *                       projectStartDate:
 *                         type: string
 *                         format: date
 *                         example: "2024-08-01"
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
projectRouter.get('/project/:id/employeeDetails', isAuth, getEmployeeDetails);
/**
 * @swagger
 * /projects/update/{id}:
 *   put:
 *     summary: Update an existing project
 *     description: Update the details of an existing project by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The project ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectName:
 *                 type: string
 *                 example: "Updated Project"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-09-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-31"
 *               category:
 *                 type: string
 *                 example: "US"
 *               status:
 *                 type: string
 *                 example: "InProgress"
 *               clientContactNumber:
 *                 type: string
 *                 example: "+19876543210"
 *               clientEmail:
 *                 type: string
 *                 format: email
 *                 example: "clientupdated@example.com"
 *     responses:
 *       200:
 *         description: Project updated successfully
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
 *                   example: "Updated Project"
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-09-01"
 *                 endDate:
 *                   type: string
 *                   format: date
 *                   example: "2025-01-31"
 *                 category:
 *                   type: string
 *                   example: "US"
 *                 status:
 *                   type: string
 *                   example: "InProgress"
 *                 clientContactNumber:
 *                   type: string
 *                   example: "+19876543210"
 *                 clientEmail:
 *                   type: string
 *                   format: email
 *                   example: "clientupdated@example.com"
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
projectRouter.put('/update/:id', isAuth, updateProject);

/**
 * @swagger
 * /projects/delete/{id}:
 *   delete:
 *     summary: Delete a project
 *     description: Delete a project by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The project ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
projectRouter.delete('/delete/:id', isAuth, deleteProject);

/**
 * @swagger
 * /projects/getProjectById/{id}:
 *   get:
 *     summary: Get project details by ID
 *     description: Retrieve the project details by project ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The project ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project fetched successfully
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
 *                 createdBy:
 *                   type: string
 *                   example: "60c72b2f4f1a2c001c8e4f34"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-08-01T18:25:43.511Z"
 *                 incomeDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-08-01"
 *                       amount:
 *                         type: number
 *                         example: 1000
 *                       description:
 *                         type: string
 *                         example: "Income description"
 *                       source:
 *                         type: string
 *                         example: "Income source"
 *                 expenseDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-08-01"
 *                       amount:
 *                         type: number
 *                         example: 500
 *                       description:
 *                         type: string
 *                         example: "Expense description"
 *                       vendor:
 *                         type: string
 *                         example: "Vendor name"
 *                       invoiceNumber:
 *                         type: string
 *                         example: "INV123456"
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
projectRouter.get('/getProjectById/:id', isAuth, getProjectById);


export default projectRouter;
