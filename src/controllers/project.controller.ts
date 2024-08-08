import { Request, Response } from "express";
import logger from "../utils/logger";
import { createProjectService, getAllocatedProjectsByUserIdService, getAllProjectsService, getProjectStatusCountService, updateProjectService, deleteProjectService, getProjectByIdService, getIncomeDetailsByProjectId, getExpenseDetailsByProjectId, getEmployeeDetailsByProjectId } from "../services/project.services";
import { AppError, BadRequestError } from "../models/errors";
import { createProjectDto, updateProjectDto } from "../models/project.model";
import Jwt from "jsonwebtoken";

export const createProject = async (req: Request, res: Response) => {
    try {
        const projectData: createProjectDto = req.body;
        logger.info(`Received project data: ${JSON.stringify(projectData)}`);
        const response: any = await createProjectService(projectData);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            throw new AppError('Not Authenticated', 401);
        }
        const token = authHeader.split(' ')[1];
        const decodedToken: any = Jwt.decode(token);
        if (decodedToken.role === 'admin') {
            const response = await getAllProjectsService();
            res.status(response.code).send(response);
        }
        if (decodedToken.role === 'user') {
            const response = await getAllocatedProjectsByUserIdService(decodedToken.userId);
            res.status(response.code).send(response);
        }

    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}

export const getProjectStatusCount = async (req: Request, res: Response) => {
    try {
        const response = await getProjectStatusCountService();
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}

export const updateProject = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;
        const projectData: updateProjectDto = req.body;
        logger.info(`Received project update data: ${JSON.stringify(projectData)}`);
        const response: any = await updateProjectService(projectId, projectData);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;
        logger.info(`Received request to delete project with ID: ${projectId}`);
        const response: any = await deleteProjectService(projectId);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}

export const getProjectById=async(req:Request,res:Response)=>{
    try {
        const projectId=req.params.id;
        const response= await getProjectByIdService(projectId)
        res.status(response.code).send(response);
    } catch (error:any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}

export  const getIncomeDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const response = await getIncomeDetailsByProjectId(id);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}

export const getExpenseDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const response = await getExpenseDetailsByProjectId(id);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }

}

export const getEmployeeDetails= async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const response = await getEmployeeDetailsByProjectId(id);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}
