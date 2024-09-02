import { Request, Response } from "express";
import logger from "../utils/logger";
import { createProjectService, getAllocatedProjectsByUserIdService, getAllProjectsService, getProjectStatusCountService, updateProjectService, deleteProjectService, getProjectByIdService, getIncomeDetailsByProjectId, getExpenseDetailsByProjectId, getEmployeeDetailsByProjectId, addEmployeeDetailToProject, addExpenseDetailToProject, addIncomeDetailToProject, removeEmployeeDetailFromProject, removeExpenseDetailFromProject, removeIncomeDetailFromProject, updateEmployeeDetailInProject, updateExpenseDetailInProject, updateIncomeDetailInProject, getProjectFinancialSummaryService, getProjectListService } from "../services/project.services";
import { AppError, BadRequestError } from "../models/errors";
import { createProjectDto, updateProjectDto } from "../models/project.model";
import Jwt from "jsonwebtoken";
import Roles from "../enums/roles";

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
        if (decodedToken.role === Roles.ADMIN) {
            const response = await getAllProjectsService();
            res.status(response.code).send(response);
        }
        if (decodedToken.role === Roles.USER) {
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

export const createIncomeDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const incomeDetail = req.body;
        const response = await addIncomeDetailToProject(id, incomeDetail);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
};

export const createExpenseDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const expenseDetail = req.body;
        const response = await addExpenseDetailToProject(id, expenseDetail);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
};

export const createEmployeeDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const employeeDetail = req.body;
        logger.info(`createEmployeeDetailController: Received employee detail: ${JSON.stringify(employeeDetail)} for project with ID: ${id}`);
        const response = await addEmployeeDetailToProject(id, employeeDetail);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
};

export const updateIncomeDetail = async (req: Request, res: Response) => {
    try {
        const { id, incomeId } = req.params;
        const updatedIncomeDetail = req.body;
        const response = await updateIncomeDetailInProject(id, incomeId, updatedIncomeDetail);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
};

export const updateExpenseDetail = async (req: Request, res: Response) => {
    try {
        const { id, expenseId } = req.params;
        const updatedExpenseDetail = req.body;
        const response = await updateExpenseDetailInProject(id, expenseId, updatedExpenseDetail);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
};

export const updateEmployeeDetail = async (req: Request, res: Response) => {
    try {
        const { id, employeeId } = req.params;
        const updatedEmployeeDetail = req.body;
        const response = await updateEmployeeDetailInProject(id, employeeId, updatedEmployeeDetail);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
};

export const deleteIncomeDetail = async (req: Request, res: Response) => {
    try {
        const { id, incomeId } = req.params;
        const response = await removeIncomeDetailFromProject(id, incomeId);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
};

export const deleteExpenseDetail = async (req: Request, res: Response) => {
    try {
        const { id, expenseId } = req.params;
        const response = await removeExpenseDetailFromProject(id, expenseId);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
};

export const deleteEmployeeDetail = async (req: Request, res: Response) => {
    try {
        const { id, employeeId } = req.params;
        const response = await removeEmployeeDetailFromProject(id, employeeId);
        res.status(response.code).send(response);
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
};

export const getProjectFinancialSummary = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;
        const Response = await getProjectFinancialSummaryService(projectId);

        res.status(200).send(Response);
    } catch (error: any) {
        logger.error(`Error in getProjectFinancialSummary: ${error.message}`);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

export const getProjectList =async(req:Request,res:Response)=>{
    try {
        const response= await getProjectListService();
        res.status(response.code).send(response);
    } catch (error:any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).send({ message: error.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
}