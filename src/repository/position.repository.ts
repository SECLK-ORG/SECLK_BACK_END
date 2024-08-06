import positionSchema from '../database/models/position';
import logger from '../utils/logger';

export const createPositionRepo = async (positions: string) => {
    try {
        const newPosition = await positionSchema.create({ positions });
        return newPosition;
    } catch (error: any) {
        logger.error(`Error in createPositionRepo: ${error.message}`);
        throw new Error(error.message);
    }
};

export const getAllPositionsRepo = async () => {
    try {
        const positions = await positionSchema.find();
        return positions;
    } catch (error: any) {
        logger.error(`Error in getAllPositionsRepo: ${error.message}`);
        throw new Error(error.message);
    }
};

export const updatePositionRepo = async (id: string, positions: string) => {
    try {
        const updatedPosition = await positionSchema.findByIdAndUpdate(id, { positions }, { new: true });
        return updatedPosition;
    } catch (error: any) {
        logger.error(`Error in updatePositionRepo: ${error.message}`);
        throw new Error(error.message);
    }
};

export const deletePositionRepo = async (id: string) => {
    try {
        const deletedPosition = await positionSchema.findByIdAndDelete(id);
        return deletedPosition;
    } catch (error: any) {
        logger.error(`Error in deletePositionRepo: ${error.message}`);
        throw new Error(error.message);
    }
};
