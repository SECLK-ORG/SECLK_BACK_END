import mongoose from 'mongoose';
import projectSchema from '../database/models/project';
import Status from '../enums/status';
import { createProjectDto, updateProjectDto } from '../models/project.model';
import logger from '../utils/logger';
import { Income, Expense } from '../models/common';

export const getAllProjectsRepo = async () => {
    try {
        const projects = await projectSchema.find();
        return projects;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const createProjectRepo = async (projectData: createProjectDto) => {
    try {
        const project = await projectSchema.create(projectData);
        return project;
    } catch (error: any) {
        logger.error(`Error in createUser: ${error.message}`);
        throw new Error(error.message);
    }
};

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
};

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
};

export const updateProjectRepo = async (projectId: string, projectData: updateProjectDto) => {
    try {
        const updatedProject = await projectSchema.findByIdAndUpdate(projectId, projectData, { new: true });
        return updatedProject;
    } catch (error: any) {
        logger.error(`Error updating project: ${error.message}`);
        throw new Error(error.message);
    }
};

export const deleteProjectRepo = async (projectId: string) => {
    try {
        logger.info(`Deleting project with id: ${projectId}`);
        const deletedProject = await projectSchema.findByIdAndDelete(projectId);
        return deletedProject;
    } catch (error: any) {
        logger.error(`Error deleting project: ${error.message}`);
        throw new Error(error.message);
    }
};

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
};

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
};

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
};

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
};

export const addIncomeDetailToProjectRepo = async (projectId: string, incomeDetail: any) => {
    try {
        logger.info(`Adding income detail to project with id: ${projectId}`);

        if (!incomeDetail.invoiceNumber) {
            incomeDetail.invoiceNumber = await generateUniqueInvoiceNumber();
        }

        const project = await projectSchema.findByIdAndUpdate(
            projectId,
            { $push: { incomeDetails: incomeDetail } },
            { new: true }
        );

        await recalculateProjectTotals(projectId);

        logger.info(`addIncomeDetailToProjectRepo: Added income detail: ${JSON.stringify(incomeDetail)}`);
        return project;
    } catch (error: any) {
        logger.error(`Error adding income detail: ${error.message}`);
        throw new Error(error.message);
    }
};

export const addExpenseDetailToProjectRepo = async (projectId: string, expenseDetail: any) => {
    try {
        logger.info(`Adding expense detail to project with id: ${projectId}, expense detail: ${JSON.stringify(expenseDetail)}`);

         // Generate a unique invoice number if not provided
         if (!expenseDetail.invoiceNumber) {
            expenseDetail.invoiceNumber = await generateUniqueInvoiceNumber();
        }

        const project = await projectSchema.findByIdAndUpdate(
            projectId,
            { $push: { expenseDetails: expenseDetail } },
            { new: true }
        );

        await recalculateProjectTotals(projectId);

        logger.info(`addExpenseDetailToProjectRepo: Added expense detail: ${JSON.stringify(expenseDetail)}`);
        return project;
    } catch (error: any) {
        logger.error(`Error adding expense detail: ${error.message}`);
        throw new Error(error.message);
    }
};

export const addEmployeeDetailToProjectRepo = async (projectId: string, employeeDetail: any) => {
    try {
        logger.info(`Adding employee detail to project with id: ${projectId}`);
        const project = await projectSchema.findByIdAndUpdate(
            projectId,
            { $push: { employees: employeeDetail } },
            { new: true }
        );

        await recalculateProjectTotals(projectId);

        logger.info(`addEmployeeDetailToProjectRepo: Added employee detail: ${JSON.stringify(employeeDetail)}`);
        return project;
    } catch (error: any) {
        logger.error(`Error adding employee detail: ${error.message}`);
        throw new Error(error.message);
    }
};

export const updateIncomeDetailInProjectRepo = async (projectId: string, incomeId: string, updatedIncomeDetail: any) => {
    try {
        logger.info(`Updating income detail with id: ${incomeId} in project with id: ${projectId}`);

        // Construct the $set object to only update the fields provided
        const setFields:any = {};
        for (const [key, value] of Object.entries(updatedIncomeDetail)) {
            setFields[`incomeDetails.$.${key}`] = value;
        }

        const project = await projectSchema.findOneAndUpdate(
            { _id: projectId, "incomeDetails._id": incomeId },
            { $set: setFields },
            { new: true }
        );

        await recalculateProjectTotals(projectId);

        logger.info(`updateIncomeDetailInProjectRepo: Updated income detail with fields: ${JSON.stringify(updatedIncomeDetail)}`);
        return project;
    } catch (error: any) {
        logger.error(`Error updating income detail: ${error.message}`);
        throw new Error(error.message);
    }
};

export const updateExpenseDetailInProjectRepo = async (projectId: string, expenseId: string, updatedExpenseDetail: any) => {
    try {
        logger.info(`Updating expense detail with id: ${expenseId} in project with id: ${projectId}`);

        // Construct the $set object to only update the fields provided
        const setFields:any = {};
        for (const [key, value] of Object.entries(updatedExpenseDetail)) {
            setFields[`expenseDetails.$.${key}`] = value;
        }

        const project = await projectSchema.findOneAndUpdate(
            { _id: projectId, "expenseDetails._id": expenseId },
            { $set: setFields },
            { new: true }
        );

        await recalculateProjectTotals(projectId);

        logger.info(`updateExpenseDetailInProjectRepo: Updated expense detail with fields: ${JSON.stringify(updatedExpenseDetail)}`);
        return project;
    } catch (error: any) {
        logger.error(`Error updating expense detail: ${error.message}`);
        throw new Error(error.message);
    }
};

export const updateEmployeeDetailInProjectRepo = async (projectId: string, employeeId: string, updatedEmployeeDetail: any) => {
    try {
        logger.info(`Updating employee detail with id: ${employeeId} in project with id: ${projectId}`);
        const project = await projectSchema.findOneAndUpdate(
            { _id: projectId, "employees._id": employeeId },
            { $set: { "employees.$": updatedEmployeeDetail } },
            { new: true }
        );

        await recalculateProjectTotals(projectId);

        logger.info(`updateEmployeeDetailInProjectRepo: Updated employee detail: ${JSON.stringify(updatedEmployeeDetail)}`);
        return project;
    } catch (error: any) {
        logger.error(`Error updating employee detail: ${error.message}`);
        throw new Error(error.message);
    }
};

export const removeIncomeDetailFromProjectRepo = async (projectId: string, incomeId: string) => {
    try {
        logger.info(`Removing income detail with id: ${incomeId} from project with id: ${projectId}`);
        const project = await projectSchema.findByIdAndUpdate(
            projectId,
            { $pull: { incomeDetails: { _id: incomeId } } },
            { new: true }
        );

        await recalculateProjectTotals(projectId);

        logger.info(`removeIncomeDetailFromProjectRepo: Removed income detail with id: ${incomeId}`);
        return project;
    } catch (error: any) {
        logger.error(`Error removing income detail: ${error.message}`);
        throw new Error(error.message);
    }
};

export const removeExpenseDetailFromProjectRepo = async (projectId: string, expenseId: string) => {
    try {
        logger.info(`Removing expense detail with id: ${expenseId} from project with id: ${projectId}`);
        const project = await projectSchema.findByIdAndUpdate(
            projectId,
            { $pull: { expenseDetails: { _id: expenseId } } },
            { new: true }
        );

        await recalculateProjectTotals(projectId);

        logger.info(`removeExpenseDetailFromProjectRepo: Removed expense detail with id: ${expenseId}`);
        return project;
    } catch (error: any) {
        logger.error(`Error removing expense detail: ${error.message}`);
        throw new Error(error.message);
    }
};

export const removeEmployeeDetailFromProjectRepo = async (projectId: string, employeeId: string) => {
    try {
        logger.info(`Removing employee detail with id: ${employeeId} from project with id: ${projectId}`);
        const project = await projectSchema.findByIdAndUpdate(
            projectId,
            { $pull: { employees: { _id: employeeId } } },
            { new: true }
        );

        await recalculateProjectTotals(projectId);

        logger.info(`removeEmployeeDetailFromProjectRepo: Removed employee detail with id: ${employeeId}`);
        return project;
    } catch (error: any) {
        logger.error(`Error removing employee detail: ${error.message}`);
        throw new Error(error.message);
    }
};

const generateUniqueInvoiceNumber = async (): Promise<string> => {
    let invoiceNumber: string = '';
    let isUnique = false;

    try {
        while (!isUnique) {
            invoiceNumber = Math.floor(100000000 + Math.random() * 900000000).toString(); // 9-digit random number

            const existingIncome = await projectSchema.findOne({ "incomeDetails.invoiceNumber": invoiceNumber });
            const existingExpense = await projectSchema.findOne({ "expenseDetails.invoiceNumber": invoiceNumber });

            if (!existingIncome && !existingExpense) {
                isUnique = true;
            }
        }
    } catch (error:any) {
        // Log the error and rethrow it so it can be handled by the calling function
        console.error(`Error generating unique invoice number: ${error.message}`);
        throw new Error(`Error generating unique invoice number: ${error.message}`);
    }

    return invoiceNumber;
};

const recalculateProjectTotals = async (projectId: string) => {
    const project = await projectSchema.findById(projectId);

    if (project) {
        project.totalIncome = project.incomeDetails.reduce((sum: number, income: Income) => sum + income.amount, 0);
        project.totalExpenses = project.expenseDetails.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
        await project.save();
    }
};
