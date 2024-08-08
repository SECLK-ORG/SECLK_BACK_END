import { AppError, BadRequestError } from "../models/errors";
import { createProjectDto, updateProjectDto } from "../models/project.model";
import { responseFormate } from "../models/response";
import { createProjectRepo, getAllocatedProjectsByUserIdServiceRepo, getAllProjectsRepo, getProjectStatusCountRepo, updateProjectRepo, deleteProjectRepo, getProjectByIdRepo, getIncomeDetailsBYProjectIdRepo, getEmployeeDetailsBYProjectIdRepo, getExpenseDetailsBYProjectIdRepo } from "../repository/project.repository";
import logger from "../utils/logger";

export const getAllProjectsService = async () => {
    try {
        const projects = await getAllProjectsRepo();
        const response: responseFormate = {
            code: 200,
            data: projects,
            message: "Projects Fetched"
        };

        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const createProjectService = async (projectData: createProjectDto) => {
    try {
        const project = await createProjectRepo(projectData);
        const response: responseFormate = {
            code: 201,
            data: project,
            message: "Project Created"
        };
        return response;

    } catch (error: any) {
        throw new BadRequestError(error.message);
    }
}

export const getProjectStatusCountService = async () => {
    try {
        const projectsCounts = await getProjectStatusCountRepo();
        const response: responseFormate = {
            code: 200,
            data: projectsCounts,
            message: "Projects Fetched"
        };
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const getAllocatedProjectsByUserIdService = async (userId: string) => {
    try {
        const projects = await getAllocatedProjectsByUserIdServiceRepo(userId);
        const response: responseFormate = {
            code: 200,
            data: projects,
            message: "Projects Fetched"
        };
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const updateProjectService = async (projectId: string, projectData: updateProjectDto) => {
    try {
        const updatedProject = await updateProjectRepo(projectId, projectData);
        const response: responseFormate = {
            code: 200,
            data: updatedProject,
            message: "Project Updated"
        };
        return response;
    } catch (error: any) {
        throw new BadRequestError(error.message);
    }
}

export const deleteProjectService = async (projectId: string) => {
    try {
         const isProjectAllocated = await getProjectIsAllocatedService(projectId);
         if(isProjectAllocated){
            logger.error(`Project is allocated to employee Cannot delete project with ID: ${projectId}`);
            throw new AppError('Project is allocated to employee',400);
         }
         logger.info(`Received request to delete project with ID: ${projectId}`);
        const deletedProject = await deleteProjectRepo(projectId);
        const response: responseFormate = {
            code: 200,
            data: deletedProject,
            message: "Project Deleted"
        };
        return response;
    } catch (error: any) {
        throw new AppError(error,400);
    }
}

const getProjectIsAllocatedService = async (projectId: string) => {
     const projectData:any=  await getProjectByIdRepo(projectId)
     console.log("projectData.employees.length",projectData.employees.length)
        if(projectData.employees.length>0){
            return true
        }
        return false
}

export const getProjectByIdService = async (projectId: string) => {
    try {
        const project = await getProjectByIdRepo(projectId);
        const response: responseFormate = {
            code: 200,
            data: project,
            message: "Project Fetched"
        };
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const getIncomeDetailsByProjectId = async (projectId: string) => {
    try {
        const project = await getIncomeDetailsBYProjectIdRepo(projectId);
        const response: responseFormate = {
            code: 200,
            data: project,
            message: "Project Fetched"
        };
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
export const getExpenseDetailsByProjectId = async (projectId: string) => {
    try {
        const project = await getExpenseDetailsBYProjectIdRepo(projectId);
        const response: responseFormate = {
            code: 200,
            data: project,
            message: "Project Fetched"
        };
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
}
export const getEmployeeDetailsByProjectId =async (projectId: string) => {
    try {
        const project = await getEmployeeDetailsBYProjectIdRepo(projectId);
        const response: responseFormate = {
            code: 200,
            data: project,
            message: "Project Fetched"
        };
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
}