import { Request, Response } from "express";
import { Key } from "../database";
import config from "../config/config";
import { ApiError } from "../utils";

const jwtSecret = config.JWT_SECRET as string;
const COOKIE_EXPIRATION_DAYS = 90;
const expirationDate = new Date(
    Date.now() + COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
);
const cookieOptions = {
    expires: expirationDate,
    secure: false,
    httpOnly: true,
};

const getAll = async (req: Request, res: Response): Promise<any> => {
    try {
        const keys = await Key.find();
        return res.status(200).json({
            status: 200,
            message: "Applications fetched successfully!",
            keys
        })
    } catch (error: any) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
            });
        }

        return res.status(500).json({
            status: 500,
            message: error.message,
            ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
        });
    }
}

const create = async (req: Request, res: Response): Promise<any> => {
    try {
        const { uid, apikey } = req.body;
        const keyExists = await Key.findOne({ uid }); //only allow creation of one key set per uid
        if(keyExists) throw new ApiError(400, "Key already exists for the user!");

        const key = await Key.create({ uid, apikey });

        return res.status(201).json({
            status: 201,
            message: "API Key created successfully!",
            key
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
            });
        }

        return res.status(500).json({
            status: 500,
            message: error.message,
            ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
        });
    }
};

const updateById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedKey = await Key.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedKey) {
            throw new ApiError(404, "API Key not found");
        }

        return res.status(200).json({
            status: 200,
            message: "API Key updated successfully!",
            key: updatedKey
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
            });
        }

        return res.status(500).json({
            status: 500,
            message: error.message,
            ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
        });
    }
};

const deleteById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const deletedKey = await Key.findByIdAndDelete(id);

        if (!deletedKey) {
            throw new ApiError(404, "API Key not found");
        }

        return res.status(200).json({
            status: 200,
            message: "API Key deleted successfully!"
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
            });
        }

        return res.status(500).json({
            status: 500,
            message: error.message,
            ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
        });
    }
};

const getByUid = async (req: Request, res: Response): Promise<any> => {
    try {
        const { uid } = req.params;

        const keys = await Key.find({ uid });

        return res.status(200).json({
            status: 200,
            message: "API Keys fetched successfully!",
            keys
        });
    } catch (error: any) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
            });
        }

        return res.status(500).json({
            status: 500,
            message: error.message,
            ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
        });
    }
};

export default { getAll, getByUid, create, updateById, deleteById };