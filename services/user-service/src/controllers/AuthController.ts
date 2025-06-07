import express, { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { User, IUser } from '../database';
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

const createSendToken = async (user: IUser, res: Response) => {
    const { firstName, lastName, email, id } = user;
    const token = jwt.sign({ firstName, lastName, email, id }, jwtSecret, {
        expiresIn: "1d",
    });
    if (config.NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);

    return token;
};

const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if(userExists){
            throw new ApiError(400, "User already exists!");
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: await encryptPassword(password)
        })

        const userData = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }

        return res.status(200).json({
            status: 200,
            message: "User registered successfully!",
            data: userData,
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
        });
    }
}

const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        const passMatch = await isPasswordMatch(password, user?.password as string);
        if(!user || !passMatch) throw new ApiError(400, "Incorrect email or password");

        const token = await createSendToken(user!, res);

        // Remove password before sending the user object
        const { password: _, ...userWithoutPassword } = user.toObject();
        return res.status(200).json({
            status: 200,
            message: "User logged in successfully!",
            user: userWithoutPassword,
            token
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

const all = async (req: Request, res: Response): Promise<any> => {
    try {
        const users = await User.find().select("-password");;

        return res.status(200).json({
            status: 200,
            message: "Users fetched successfully!",
            users
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

const getOne = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user) throw new ApiError(404, "User not found");

        const { password: _, ...userWithoutPassword } = user.toObject();
        return res.status(200).json({
            status: 200,
            message: "User retrieved successfully!",
            user: userWithoutPassword
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

const update = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, updates, {
            new: true, // return the updated document
            runValidators: true // validate against schema
        })
        if (!updatedUser) throw new ApiError(404, "User not found");

        return res.status(200).json({
            status: 200,
            message: "User updated successfully!",
            user: updatedUser
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
}

const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) throw new ApiError(404, "User not found");

        return res.status(200).json({
            status: 200,
            message: "User deleted successfully!",
            user: deletedUser,
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
}

export default { register, login, all, update, deleteUser, getOne };