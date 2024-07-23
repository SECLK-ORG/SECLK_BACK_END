import { responseFormate } from "../models/response";
import { getAllProjectsRepo } from "../repository/project.repository";

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