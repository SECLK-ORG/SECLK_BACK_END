import { createPositionRepo, getAllPositionsRepo, updatePositionRepo, deletePositionRepo } from '../repository/position.repository';
import { responseFormate } from '../models/response';

export const createPositionService = async (positions: string) => {
    try {
        const newPosition = await createPositionRepo(positions);
        const response: responseFormate = {
            code: 201,
            data: newPosition,
            message: "Position Created"
        };
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getAllPositionsService = async () => {
    try {
        const positions = await getAllPositionsRepo();
        const response: responseFormate = {
            code: 200,
            data: positions,
            message: "Positions Fetched"
        };
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const updatePositionService = async (id: string, positions: string) => {
    try {
        const updatedPosition = await updatePositionRepo(id, positions);
        const response: responseFormate = {
            code: 200,
            data: updatedPosition,
            message: "Position Updated"
        };
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const deletePositionService = async (id: string) => {
    try {
        const deletedPosition = await deletePositionRepo(id);
        const response: responseFormate = {
            code: 200,
            data: deletedPosition,
            message: "Position Deleted"
        };
        return response;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
