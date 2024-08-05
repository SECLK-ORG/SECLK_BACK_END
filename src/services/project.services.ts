import { AppError, BadRequestError } from "../models/errors";
import { createProjectDto } from "../models/project.model";
import { responseFormate } from "../models/response";
import { createProjectRepo, getAllProjectsRepo, getProjectStatusCountRepo } from "../repository/project.repository";

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
        
    } catch (error:any) {
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
