import { Request, Response } from 'express';
import { createCategoryService, getAllCategoriesService, updateCategoryService, deleteCategoryService } from '../services/category.services';
import logger from '../utils/logger';

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.body;
        const response = await createCategoryService(category);
        res.status(response.code).send(response);
    } catch (error: any) {
        logger.error(`Error creating category: ${error.message}`);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const response = await getAllCategoriesService();
        res.status(response.code).send(response);
    } catch (error: any) {
        logger.error(`Error fetching categories: ${error.message}`);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { category } = req.body;
        const response = await updateCategoryService(id, category);
        res.status(response.code).send(response);
    } catch (error: any) {
        logger.error(`Error updating category: ${error.message}`);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const response = await deleteCategoryService(id);
        res.status(response.code).send(response);
    } catch (error: any) {
        logger.error(`Error deleting category: ${error.message}`);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};
