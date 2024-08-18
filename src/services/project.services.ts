import { EmployeePayloadDto } from "../models/common";
import { AppError, BadRequestError, NotFoundError } from "../models/errors";
import { createProjectDto, updateProjectDto } from "../models/project.model";
import { responseFormate } from "../models/response";
import { createProjectRepo, getAllocatedProjectsByUserIdServiceRepo, getAllProjectsRepo, getProjectStatusCountRepo, updateProjectRepo, deleteProjectRepo, getProjectByIdRepo, getIncomeDetailsBYProjectIdRepo, getEmployeeDetailsBYProjectIdRepo, getExpenseDetailsBYProjectIdRepo, addIncomeDetailToProjectRepo, addEmployeeDetailToProjectRepo, addExpenseDetailToProjectRepo, removeEmployeeDetailFromProjectRepo, removeExpenseDetailFromProjectRepo, removeIncomeDetailFromProjectRepo, updateEmployeeDetailInProjectRepo, updateExpenseDetailInProjectRepo, updateIncomeDetailInProjectRepo, getProjectFinancialSummaryRepo } from "../repository/project.repository";
import { updateUserId } from "../repository/user.repository";
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
         throw new AppError(error,400);
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
         throw new AppError(error,400);
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
         throw new AppError(error,400);
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
         throw new AppError(error,400);
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
         throw new AppError(error,400);
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
         throw new AppError(error,400);
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
         throw new AppError(error,400);
    }
}

export const addIncomeDetailToProject = async (projectId: string, incomeDetail: any) => {
    try {
        const project = await addIncomeDetailToProjectRepo(projectId, incomeDetail);
        return {
            code: 200,
            data: project,
            message: "Income detail added successfully"
        };
    } catch (error: any) {
         throw new AppError(error,400);
    }
};

export const addExpenseDetailToProject = async (projectId: string, expenseDetail: any) => {
    try {
        const project = await addExpenseDetailToProjectRepo(projectId, expenseDetail);
        return {
            code: 200,
            data: project,
            message: "Expense detail added successfully"
        };
    } catch (error: any) {
         throw new AppError(error,400);
    }
};

export const addEmployeeDetailToProject = async (projectId: string, employeeDetail: any) => {
    try {
        const project = await addEmployeeDetailToProjectRepo(projectId, employeeDetail);
        return {
            code: 200,
            data: project,
            message: "Employee detail added successfully"
        };
    } catch (error: any) {  
        throw new AppError(error,400);
    }
};

export const updateIncomeDetailInProject = async (projectId: string, incomeId: string, updatedIncomeDetail: any) => {
    try {
        const project = await updateIncomeDetailInProjectRepo(projectId, incomeId, updatedIncomeDetail);
        return {
            code: 200,
            data: project,
            message: "Income detail updated successfully"
        };
    } catch (error: any) {
        throw new AppError(error,400);
    }
};

export const updateExpenseDetailInProject = async (projectId: string, expenseId: string, updatedExpenseDetail: any) => {
    try {
        const project = await updateExpenseDetailInProjectRepo(projectId, expenseId, updatedExpenseDetail);
        return {
            code: 200,
            data: project,
            message: "Expense detail updated successfully"
        };
    } catch (error: any) {
        throw new AppError(error,400);
    }
};

export const updateEmployeeDetailInProject = async (projectId: string, employeeId: string, updatedEmployeeDetail: any) => {
    try {
        const project = await updateEmployeeDetailInProjectRepo(projectId, employeeId, updatedEmployeeDetail);
        return {
            code: 200,
            data: project,
            message: "Employee detail updated successfully"
        };
    } catch (error: any) {
        throw new AppError(error,400);
    }
};

export const removeIncomeDetailFromProject = async (projectId: string, incomeId: string) => {
    try {
        const project = await removeIncomeDetailFromProjectRepo(projectId, incomeId);
        return {
            code: 200,
            data: project,
            message: "Income detail deleted successfully"
        };
    } catch (error: any) {
        throw new AppError(error,400);
    }
};

export const removeExpenseDetailFromProject = async (projectId: string, expenseId: string) => {
    try {
        const project = await removeExpenseDetailFromProjectRepo(projectId, expenseId);
        return {
            code: 200,
            data: project,
            message: "Expense detail deleted successfully"
        };
    } catch (error: any) {
         throw new AppError(error,400);
    }
};

export const removeEmployeeDetailFromProject = async (projectId: string, employeeId: string) => {
    try {
        const project = await removeEmployeeDetailFromProjectRepo(projectId, employeeId);
        return {
            code: 200,
            data: project,
            message: "Employee detail deleted successfully"
        };
    } catch (error: any) {
         throw new AppError(error,400);
    }
};

export const getProjectFinancialSummaryService = async (projectId: string) => {
    try {
        const project = await getProjectFinancialSummaryRepo(projectId);

        // Calculate additional data
        const remainingExpenses = project.totalIncome - project.totalExpenses;
        const remainingIncome = project.agreedAmount - project.totalIncome;
        const totalProfit = project.totalIncome - project.totalExpenses;
        const currentMonthProfit = project.incomeCurrentMonth - project.expensesCurrentMonth;

        // Calculate percentages
        const ExpensesPercentage = (project.totalExpenses / project.totalIncome) * 100;
        const IncomePercentage = (project.totalIncome / project.agreedAmount) * 100;

        // Add these calculations to the project object or create a new response object
        const financialSummary = {
            ...project,
            remainingExpenses,
            remainingIncome,
            totalProfit,
            currentMonthProfit,
            ExpensesPercentage,
            IncomePercentage
        };

        const response: responseFormate = {
            code: 200,
            data: financialSummary,
            message: "Financial Summary Fetched"
        };
        return response;

    } catch (error: any) {
         throw new AppError(error,400);
    }
}
export const updateUserService = async (userId: string, userData: EmployeePayloadDto) => {
    try {
        logger.info(`Service: Initiating update for user ID: ${userId}`);

        const updatedUser = await updateUserId(userId, userData);

        if (!updatedUser) {
            logger.warn(`Service: User not found, ID: ${userId}`);
            throw new NotFoundError("User not found");
        }

        const response: responseFormate = {
            code: 200,
            data: updatedUser,
            message: "User updated successfully"
        };

        logger.info(`Service: User updated successfully, ID: ${userId}`);

        return response;
    } catch (error: any) {
        logger.error(`Service: Error updating user, ID: ${userId}`, error);
        throw new AppError(error.message, 400);
    }
};