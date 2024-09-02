import { user } from "../models/user.model";
import userSchema from '../database/models/user';
import logger from "../utils/logger";
import { EmployeePayloadDto } from "../models/common";
import { ConflictError } from "../models/errors";
import position from "../database/models/position";

export const createUser = async (userData: user) => {
    try {
        const newUser = await userSchema.create(userData);
        return newUser;
    } catch (error: any) {
        logger.error(`Error in createUser: ${error.message}`);
        throw new Error(error.message);
    }
}

export const findUserByEmail = async (email: string) => {
    try {
        logger.info(`findUserByEmail - ${email.toLowerCase()}`);
        const user = await userSchema.findOne({ email: email.toLowerCase() });
        return user;
    } catch (error: any) {
        logger.error(`Error in findUserByEmail: ${error.message}`);
        throw new Error(error.message);
    }
}
export const getAllUsers = async () => {
    try {
        const users = await userSchema.find();
        return users;
    } catch (error: any) {
        logger.error(`Error in getAllUsers: ${error.message}`);
        throw new Error(error.message);
    }
}


export const searchUsersRepo = async (query: string) => {
    try {
        let users;
        if (query === ""||query===" ") {
            users = await userSchema.find({}, '_id name email position');
        } else {
            users = await userSchema.find(
                {
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { email: { $regex: query, $options: 'i' } }
                    ]
                },
                '_id name email position'
            );
        }
        return users;
    } catch (error: any) {
        logger.error(`Error in searchUsersRepo: ${error.message}`);
        throw new Error(error.message);
    }
}

export const updateUserId = async (id: string, userData: EmployeePayloadDto) => {
    try {
        logger.info(`Repository: Finding and updating user ID: ${id}`);

        const updatedUser = await userSchema.findOneAndUpdate({ _id: id }, userData, { new: true });

        if (updatedUser) {
            logger.info(`Repository: User updated successfully, ID: ${id}`);
        } else {
            logger.warn(`Repository: User not found, ID: ${id}`);
        }

        return updatedUser;
    } catch (error: any) {
        logger.error(`Repository: Error updating user, ID: ${id}`, error);
        throw new Error(error.message);
    }
};

export const deleteUserRepo = async (userId: string) => {
    try {
        logger.info(`Repository: deleteUserRepo - Checking if user with ID: ${userId} has assigned projects`);

        // Check if the user has any assigned projects
        const user = await userSchema.findById(userId);
        if (!user) {
            logger.warn(`Repository: deleteUserRepo - User with ID: ${userId} not found`);
            return null;
        }

        if (user.assignedProjects.length > 0) {
            logger.warn(`Repository: deleteUserRepo - User with ID: ${userId} has assigned projects. Aborting deletion.`);
            throw new ConflictError('User has assigned projects and cannot be deleted.');
        }

        logger.info(`Repository: deleteUserRepo - No assigned projects found for user with ID: ${userId}. Proceeding with deletion.`);

        const deletedUser = await userSchema.findByIdAndDelete(userId);

        if (deletedUser) {
            logger.info(`Repository: deleteUserRepo - User with ID: ${userId} deleted successfully`);
        } else {
            logger.warn(`Repository: deleteUserRepo - User with ID: ${userId} not found`);
        }

        return deletedUser;
    } catch (error: any) {
        logger.error(`Repository: deleteUserRepo - Error deleting user with ID: ${userId} - ${error.message}`);
        throw new Error(error.message);
    }
};

export const findUserPayments = async (userId: string) => {
    try {
        logger.info(`Repository: Fetching payment details for user ID: ${userId}`);

        const PaymentsData = await userSchema.findById(userId).select('paymentHistory') .populate({
            path: 'paymentHistory.projectId',
            model: 'Project' ,
            select: 'projectName'
        })
        return PaymentsData;
    } catch (error: any) {
        logger.error(`Repository: Error fetching payments for user ID: ${userId} - ${error.message}`);
        throw new Error(error.message);
    }
};


export const findUserAssignedProjects = async (userId: string) => {
  try {
    logger.info(`Repository: Fetching assigned projects for user ID: ${userId}`);
    
    const user = await userSchema.findById(userId).populate({
      path: 'assignedProjects',
      model: 'Project',
      select: '_id projectName  employees', // Select only the fields you need
    });
    
    if (!user) {
      logger.warn(`Repository: User with ID ${userId} not found`);
      return null;
    }
    const projectsWithMatchingEmployee = user.assignedProjects.map((project: any) => {
        const matchingEmployees = project.employees.filter((employee: any) => String(employee.employeeID._id) === userId);
    return {
        position:user.position,
        _id: project._id,
        projectName: project.projectName,
        projectStartedDate: matchingEmployees.length > 0 ? matchingEmployees[0].projectStartedDate : null,
      };
    });
    
    return projectsWithMatchingEmployee.filter(project => project.projectStartedDate !== null);
  } catch (error: any) {
    logger.error(`Repository: Error fetching assigned projects for user ID: ${userId} - ${error.message}`);
    throw new Error(error.message);
  }
};

export const findUserById = async (userId: string) => {
    try {
      logger.info(`Repository: Fetching user with ID: ${userId}`);
      
      const user = await userSchema.findById(userId).select('-password -pwResetToken -paymentHistory -__v -assignedProjects'); // Exclude sensitive fields
      
      if (!user) {
        logger.warn(`Repository: User with ID ${userId} not found`);
        return null;
      }
  
      return user;
    } catch (error: any) {
      logger.error(`Repository: Error fetching user with ID: ${userId} - ${error.message}`);
      throw new Error(error.message);
    }
  };