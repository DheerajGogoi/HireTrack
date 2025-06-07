import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils";
import config from "../config/config";

interface TokenPayload {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    iat: number;
    exp: number;
}

interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthRequest extends Request {
    user: IUser
}

const jwtSecret = config.JWT_SECRET as string;

const authMiddleWare = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return next(new ApiError(401, "Missing authorization header"));

    const [, token] = authHeader.split(" ");
    try {
        const decoded = jwt.verify(token, jwtSecret) as TokenPayload;

        req.user = {
            _id: decoded.id,
            email: decoded.email,
            createdAt: new Date(decoded.iat * 1000),
            updatedAt: new Date(decoded.exp * 1000),
            firstName: decoded.firstName,
            lastName: decoded.lastName
        };
        return next();
    } catch (error) {
        console.error(error);
        return next(new ApiError(401, "Invalid token"));
    }
}

export { authMiddleWare };