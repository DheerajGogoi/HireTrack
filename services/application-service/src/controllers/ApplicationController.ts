import express, { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { Application, IApplication } from '../database';
import { ApiError, encryptPassword, isPasswordMatch } from "../utils";
import config from '../config/config';

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

const all = async (req: Request, res: Response): Promise<any> => {
    try {
        const applications = await Application.find();
        return res.status(200).json({
            status: 200,
            message: "Applications fetched successfully!",
            applications
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

const add = async (req: Request, res: Response): Promise<any> => {
    try {
        const { uid, url, cover_letter, title, description, company } = req.body;
        const application = await Application.create({
            uid,
            url,
            cover_letter,
            title,
            description,
            company
        })
        
        return res.status(200).json({
            status: 200,
            message: "New Application added successfully!",
            application
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

const getById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const application = await Application.findById(id);

        if (!application) {
            throw new ApiError(404, "Application not found");
        }

        return res.status(200).json({
            status: 200,
            message: "Application fetched successfully",
            application
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
        const applications = await Application.find({ uid });

        return res.status(200).json({
            status: 200,
            message: "Applications fetched successfully",
            applications
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

        const application = await Application.findByIdAndUpdate(id, updates, { new: true });

        if (!application) {
            throw new ApiError(404, "Application not found");
        }

        return res.status(200).json({
            status: 200,
            message: "Application updated successfully",
            application
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
        const deleted = await Application.findByIdAndDelete(id);

        if (!deleted) {
            throw new ApiError(404, "Application not found");
        }

        return res.status(200).json({
            status: 200,
            message: "Application deleted successfully"
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


export default { all, add, getById, getByUid, updateById, deleteById };