import mongoose from 'mongoose';
import projectSchema from '../database/models/project';
import Status from '../enums/status';
import { createProjectDto, updateProjectDto } from '../models/project.model';
import logger from '../utils/logger';

export const getAllProjectsRepo = async () => {
    try {
        const projects = await projectSchema.find();
        return projects;
    } catch (error: any) {
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
            [Status.IN_PROGRESS]: 0,
            [Status.ON_HOLD]: 0,
        };

        projects.forEach(project => {
            countsByStatus[project._id] = project.count;
        });

        return countsByStatus;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const getAllocatedProjectsByUserIdServiceRepo = async (userId: string) => {
    try {
        const projects = await projectSchema.find({
            employees: userId
        });
        logger.info(`Fetched projects: ${JSON.stringify(projects)}`);

        return projects;
    } catch (error: any) {
        logger.error(`Error fetching projects: ${error.message}`);
        throw new Error(error.message);
    }
}

export const updateProjectRepo = async (projectId: string, projectData: updateProjectDto) => {
    try {
        const updatedProject = await projectSchema.findByIdAndUpdate(projectId, projectData, { new: true });
        return updatedProject;
    } catch (error: any) {
        logger.error(`Error updating project: ${error.message}`);
        throw new Error(error.message);
    }
}

export const deleteProjectRepo = async (projectId: string) => {
    try {
        logger.info(`Deleting project with id: ${projectId}`);
        const deletedProject = await projectSchema.findByIdAndDelete(projectId);
        return deletedProject;
    } catch (error: any) {
        logger.error(`Error deleting project: ${error.message}`);
        throw new Error(error.message);
    }
}

export const getProjectByIdRepo = async (projectId: string) => {
    try {
        logger.info(`Fetching project with id: ${projectId}`);
        const objectId = new mongoose.Types.ObjectId(projectId);
        const project = await projectSchema.findById(objectId).select('-__v -incomeDetails -expenseDetails');
        logger.info(`getProjectByIdRepo: Fetched project: ${JSON.stringify(project)}`);
        return project;
    } catch (error: any) {
        logger.error(`Error fetching project: ${error.message}`);
        throw new Error(error.message);
    }
}

export const getIncomeDetailsBYProjectIdRepo = async (projectId: string) => {
    try {
        logger.info(`Fetching income details for project with id: ${projectId}`);
        const objectId = new mongoose.Types.ObjectId(projectId);
        const project = await projectSchema.findById(objectId).select('incomeDetails');
        logger.info(`getIncomeDetailsBYProjectIdRepo: Fetched income details: ${JSON.stringify(project)}`);
        return project;
    } catch (error: any) {
        logger.error(`Error fetching income details: ${error.message}`);
        throw new Error(error.message);
    }

}
export const getExpenseDetailsBYProjectIdRepo = async (projectId: string) => {
    try {
        logger.info(`Fetching expense details for project with id: ${projectId}`);
        const objectId = new mongoose.Types.ObjectId(projectId);
        const project = await projectSchema.findById(objectId).select('expenseDetails');
        logger.info(`getExpenseDetailsBYProjectIdRepo: Fetched expense details: ${JSON.stringify(project)}`);
        return project;
    } catch (error: any) {
        logger.error(`Error fetching expense details: ${error.message}`);
        throw new Error(error.message);
    }
}

export const getEmployeeDetailsBYProjectIdRepo = async (projectId: string) => {
    try {
        logger.info(`Fetching employee details for project with id: ${projectId}`);
        const objectId = new mongoose.Types.ObjectId(projectId);
        const project = await projectSchema.findById(objectId).select('employees');
        logger.info(`getEmployeeDetailsBYProjectIdRepo: Fetched employee details: ${JSON.stringify(project)}`);
        return project;
    } catch (error: any) {
        logger.error(`Error fetching employee details: ${error.message}`);
        throw new Error(error.message);
    }
}