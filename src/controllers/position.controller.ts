import { Request, Response } from 'express';
import { createPositionService, getAllPositionsService, updatePositionService, deletePositionService } from '../services/position.services';
import logger from '../utils/logger';

export const createPosition = async (req: Request, res: Response) => {
    try {
        const { positions } = req.body;
        const response = await createPositionService(positions);
        res.status(response.code).send(response);
    } catch (error: any) {
        logger.error(`Error creating position: ${error.message}`);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export const getAllPositions = async (req: Request, res: Response) => {
    try {
        const response = await getAllPositionsService();
        res.status(response.code).send(response);
    } catch (error: any) {
        logger.error(`Error fetching positions: ${error.message}`);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export const updatePosition = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { positions } = req.body;
        const response = await updatePositionService(id, positions);
        res.status(response.code).send(response);
    } catch (error: any) {
        logger.error(`Error updating position: ${error.message}`);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export const deletePosition = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const response = await deletePositionService(id);
        res.status(response.code).send(response);
    } catch (error: any) {
        logger.error(`Error deleting position: ${error.message}`);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};
