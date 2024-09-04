import mongoose from 'mongoose';
import projectSchema from '../database/models/project';
import Status from '../enums/status';
import { createProjectDto, updateProjectDto } from '../models/project.model';
import logger from '../utils/logger';
import { Income, Expense } from '../models/common';
import { ConflictError } from '../models/errors';
import userSchema from '../database/models/user';
export const getAllProjectsRepo = async () => {
    try {
        logger.info("getAll projects")
        const projects = await projectSchema.find()
        return projects;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getProjectsListRepo = async () => {
    try {
        const projects = await projectSchema.find().select('projectName');
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
        const ObjectUserId = new mongoose.Types.ObjectId(userId);
        const projects = await projectSchema.find({
            'employees.employeeID._id': ObjectUserId
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

        // Add the expense detail to the project and return the updated project
        const updatedProject = await projectSchema.findByIdAndUpdate(
            projectId,
            { $push: { expenseDetails: expenseDetail } },
            { new: true }
        ).select('expenseDetails').lean();

        if (!updatedProject) {
            throw new Error('Project not found');
        }

        // Find the newly added expense by comparing the invoice number (or another unique field)
        const addedExpense:any = updatedProject.expenseDetails.find(
            (expense: any) => expense.invoiceNumber === expenseDetail.invoiceNumber
        );

        if (!addedExpense) {
            throw new Error('Failed to find the added expense detail.');
        }

        // If employeeID is available, update the userPaymentHistory with the created expense _id
        if (expenseDetail.employeeID) {
            await updateUserPaymentHistory(expenseDetail.employeeID._id, projectId,expenseDetail,addedExpense._id);
        }

        await recalculateProjectTotals(projectId);

        logger.info(`addExpenseDetailToProjectRepo: Added expense detail: ${JSON.stringify(expenseDetail)}`);
        return updatedProject;
    } catch (error: any) {
        logger.error(`Error adding expense detail: ${error.message}`);
        throw new Error(error.message);
    }
};

export const addEmployeeDetailToProjectRepo = async (projectId: string, employeeDetail: any) => {
    try {
        // Fetch the project to check if the employee already exists
        const project = await projectSchema.findById(projectId).select('employees');
        if (!project) {
            throw new Error("Project not found");
        }
        
        // Log employee details for debugging
        logger.info(`employeeDetail.employeeID._id: ${employeeDetail.employeeID._id}, project: ${project}`);

        // Check if the employee already exists in the project's employees array
        const employeeExists = project.employees.some((employee: any) => 
            employee.employeeID._id.toString() === employeeDetail.employeeID._id
        );

        logger.info(`employeeExists: ${employeeExists}`);
        
        if (employeeExists) {
            throw new ConflictError("This employee is already added to the project");
        }

        // If the employee does not exist, add them to the project
        logger.info(`Adding employee detail ${JSON.stringify(employeeDetail)} to project with id: ${projectId}`);
        const updatedProject = await projectSchema.findByIdAndUpdate(
            projectId,
            { $push: { employees: employeeDetail } },
            { new: true }
        );

        await recalculateProjectTotals(projectId);

        return updatedProject;
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

        const project = await projectSchema.findOne({ _id: projectId });
        if (!project) {
            throw new Error('Project not found');
        }

        const oldExpenseDetail = project.expenseDetails.find((expense: any) => expense._id.toString() === expenseId);
        if (!oldExpenseDetail) {
            throw new Error('Expense detail not found');
        }

        const oldEmployeeId = oldExpenseDetail.employeeID ? oldExpenseDetail.employeeID._id.toString() : null;

        const setFields: any = {};
        for (const [key, value] of Object.entries(updatedExpenseDetail)) {
            setFields[`expenseDetails.$.${key}`] = value;
        }

        const updatedProject = await projectSchema.findOneAndUpdate(
            { _id: projectId, "expenseDetails._id": expenseId },
            { $set: setFields },
            { new: true }
        );

        // Handle user payment history
        if (oldEmployeeId) {
            // Remove the old payment history entry from the old user
            await removePaymentFromUserHistory(oldEmployeeId, expenseId);
        }
        logger.info(` updatedExpenseDetail ${updatedExpenseDetail}`)
        if (updatedExpenseDetail.employeeID) {
            // Add the new payment history entry or update it for the same user
            await updateUserPaymentHistory(updatedExpenseDetail.employeeID._id, projectId, updatedExpenseDetail,expenseId);
        }

        await recalculateProjectTotals(projectId);

        logger.info(`updateExpenseDetailInProjectRepo: Updated expense detail with fields: ${JSON.stringify(updatedExpenseDetail)}`);
        return updatedProject;
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

        // Find the project and the specific expense detail
        const project = await projectSchema.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        const expenseDetail = project.expenseDetails.find((expense:any) => expense._id.toString() === expenseId);
        if (!expenseDetail) {
            throw new Error('Expense detail not found');
        }

        // Handle user payment history if employeeID is present
        if (expenseDetail.employeeID) {
            await removePaymentFromUserHistory(expenseDetail.employeeID._id, expenseId);
        }

        // Remove the expense detail from the project
        await projectSchema.findByIdAndUpdate(
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

        // Find and update the project by removing the employee
        const project = await projectSchema.findByIdAndUpdate(
            projectId,
            { $pull: { employees: { _id: employeeId } } },
            { new: true }
        );

        if (!project) {
            throw new Error('Project not found');
        }

        // Remove the project from the user's assignedProjects
        await userSchema.findByIdAndUpdate(
            employeeId,
            { $pull: { assignedProjects: projectId } }
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
            invoiceNumber = Math.floor(100000000000000 + Math.random() * 900000000000000).toString();// 9-digit random number

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

export const getProjectFinancialSummaryRepo = async (projectId: string) => {
    try {
        const objectId = new mongoose.Types.ObjectId(projectId);
        const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based, so we add 1
        const currentYear = new Date().getFullYear();

        const projectFinancial = await projectSchema.aggregate([
            { $match: { _id: objectId } },
            {
                $project: {
                    totalIncome: { $sum: "$incomeDetails.amount" },
                    totalExpenses: { $sum: "$expenseDetails.amount" },
                    agreedAmount: 1, // Include the agreedAmount in the projection
                    incomeCurrentMonth: {
                        $sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$incomeDetails",
                                        as: "income",
                                        cond: {
                                            $and: [
                                                { $eq: [{ $month: "$$income.date" }, currentMonth] },
                                                { $eq: [{ $year: "$$income.date" }, currentYear] }
                                            ]
                                        }
                                    }
                                },
                                as: "income",
                                in: "$$income.amount"
                            }
                        }
                    },
                    expensesCurrentMonth: {
                        $sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$expenseDetails",
                                        as: "expense",
                                        cond: {
                                            $and: [
                                                { $eq: [{ $month: "$$expense.date" }, currentMonth] },
                                                { $eq: [{ $year: "$$expense.date" }, currentYear] }
                                            ]
                                        }
                                    }
                                },
                                as: "expense",
                                in: "$$expense.amount"
                            }
                        }
                    }
                }
            }
        ]);

        logger.info(`getProjectFinancialSummaryRepo: Retrieved financial summary for project ID ${projectId}`);
        return projectFinancial[0];
    } catch (error: any) {
        logger.error(`Error in getProjectFinancialSummaryRepo: ${error.message}`);
        throw new Error(error.message);
    }
};


const updateUserPaymentHistory = async (userId: string, projectId: string, expenseDetail: any,expenseId:string) => {
    try {
        logger.info(`Updating payment history for user with id: ${userId},expenseDetail:${JSON.stringify(expenseDetail)}`);

        const paymentData = {
            amount: expenseDetail.amount,
            vendor: expenseDetail.vendor,
            date: expenseDetail.date,
            description: expenseDetail.description,
            category: expenseDetail.category,
            employeeID: expenseDetail.employeeID,
            invoiceNumber: expenseDetail.invoiceNumber,
            projectId: projectId,
            expenseId:expenseId
        };

        await userSchema.findByIdAndUpdate(
            userId,
            { $push: { paymentHistory: paymentData } },
            { new: true }
        );

        logger.info(`updateUserPaymentHistory: Payment history updated for user id: ${userId}`);
    } catch (error: any) {
        logger.error(`Error updating payment history: ${error.message}`);
        throw new Error(error.message);
    }
};


const removePaymentFromUserHistory = async (userId: string, expenseId: string) => {
    try {
        logger.info(`Removing payment history entry for user with id: ${userId} and expense id: ${expenseId}`);

        await userSchema.findByIdAndUpdate(
            userId,
            { $pull: { paymentHistory: { expenseId: expenseId } } },
            { new: true }
        );

        logger.info(`removePaymentFromUserHistory: Removed payment history entry for expense id: ${expenseId}`);
    } catch (error: any) {
        logger.error(`Error removing payment history entry: ${error.message}`);
        throw new Error(error.message);
    }
};

const updatePaymentInUserHistory = async (userId: string, expenseId: string, updatedExpenseDetail: any) => {
    try {
        logger.info(`Updating payment history for user with id: ${userId} and expense id: ${expenseId}`);

        const setFields: any = {};
        for (const [key, value] of Object.entries(updatedExpenseDetail)) {
            setFields[`paymentHistory.$.${key}`] = value;
        }

        await userSchema.findOneAndUpdate(
            { _id: userId, "paymentHistory._id": expenseId },
            { $set: setFields },
            { new: true }
        );

        logger.info(`updatePaymentInUserHistory: Updated payment history for user id: ${userId}`);
    } catch (error: any) {
        logger.error(`Error updating payment history: ${error.message}`);
        throw new Error(error.message);
    }
}