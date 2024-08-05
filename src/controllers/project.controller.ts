import { AppError } from "../models/errors";
import { Request, Response } from "express";
import logger from "../utils/logger";
import { createProjectService, getAllProjectsService, getProjectStatusCountService } from "../services/project.services";
import { createProjectDto } from "../models/project.model";

export const  createProject =async(req: Request, res: Response) => {
    try {
        const projectData:createProjectDto = req.body;
        logger.info(`Received project data: ${JSON.stringify(projectData)}`);
        const response:any = await createProjectService(projectData);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}

export const getAllProjects = async(req: Request, res: Response) => {
    try {
        const response = await getAllProjectsService();
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}

export const getProjectStatusCount = async(req: Request, res: Response) => {
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