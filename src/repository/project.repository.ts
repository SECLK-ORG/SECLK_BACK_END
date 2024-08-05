import projectSchema from '../database/models/project';
import Status from '../enums/status';
import { createProjectDto } from '../models/project.model';
import logger from '../utils/logger';

export const getAllProjectsRepo = async () => {
try{
    const projects = await projectSchema.find();
    return projects;
}catch(error:any){
    throw new Error(error.message);
}

}

export const createProjectRepo = async (projectData: createProjectDto) => {
    try {
        const project = await projectSchema.create(projectData);
        return project;
    } catch (error: any) {
        logger.error(`Error in createUser: ${error.message}`);
        throw new Error(error.message);
    }
}
export const getProjectStatusCountRepo = async () => {
    try {
        const projects = await projectSchema.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalProjects = await projectSchema.countDocuments();
    
        const countsByStatus: any = {
            total: totalProjects,
            [Status.COMPLETED]: 0,
            [Status.INPROGRESS]: 0,
            [Status.HOLD]: 0,
        };


        projects.forEach(project => {
            countsByStatus[project._id] = project.count;
        });

        return countsByStatus;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
