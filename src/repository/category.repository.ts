import categorySchema from '../database/models/category';
import logger from '../utils/logger';

export const createCategoryRepo = async (category: string) => {
    try {
        const newCategory = await categorySchema.create({ category });
        return newCategory;
    } catch (error: any) {
        logger.error(`Error in createCategoryRepo: ${error.message}`);
        throw new Error(error.message);
    }
};

export const getAllCategoriesRepo = async () => {
    try {
        const categories = await categorySchema.find();
        return categories;
    } catch (error: any) {
        logger.error(`Error in getAllCategoriesRepo: ${error.message}`);
        throw new Error(error.message);
    }
};

export const updateCategoryRepo = async (id: string, category: string) => {
    try {
        const updatedCategory = await categorySchema.findByIdAndUpdate(id, { category }, { new: true });
        return updatedCategory;
    } catch (error: any) {
        logger.error(`Error in updateCategoryRepo: ${error.message}`);
        throw new Error(error.message);
    }
};

export const deleteCategoryRepo = async (id: string) => {
    try {
        const deletedCategory = await categorySchema.findByIdAndDelete(id);
        return deletedCategory;
    } catch (error: any) {
        logger.error(`Error in deleteCategoryRepo: ${error.message}`);
        throw new Error(error.message);
    }
};
