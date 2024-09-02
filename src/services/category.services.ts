import { createCategoryRepo, getAllCategoriesRepo, updateCategoryRepo, deleteCategoryRepo } from '../repository/category.repository';
import { responseFormate } from '../models/response';

export const createCategoryService = async (category: string) => {
    try {
        const newCategory = await createCategoryRepo(category);
        const response: responseFormate = {
            code: 201,
            data: newCategory,
            message: "Category Created"
        };
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getAllCategoriesService = async () => {
    try {
        const categories = await getAllCategoriesRepo();
        const response: responseFormate = {
            code: 200,
            data: categories,
            message: "Categories Fetched"
        };
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const updateCategoryService = async (id: string, category: string) => {
    try {
        const updatedCategory = await updateCategoryRepo(id, category);
        const response: responseFormate = {
            code: 200,
            data: updatedCategory,
            message: "Category Updated"
        };
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const deleteCategoryService = async (id: string) => {
    try {
        const deletedCategory = await deleteCategoryRepo(id);
        const response: responseFormate = {
            code: 200,
            data: deletedCategory,
            message: "Category Deleted"
        };
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
