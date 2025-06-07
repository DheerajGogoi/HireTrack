import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { authMiddleWare } from "../middlewares";

const userRouter = Router();

userRouter.get(
    "/all",
    // @ts-ignore
    authMiddleWare,
    AuthController.all
);
userRouter.get(
    "/get/:id",
    // @ts-ignore
    authMiddleWare,
    AuthController.getOne
);

userRouter.post("/register", AuthController.register);
userRouter.post("/login", AuthController.login);

userRouter.patch(
    "/:id",
    // @ts-ignore
    authMiddleWare,
    AuthController.update
);

userRouter.delete(
    "/:id",
    // @ts-ignore
    authMiddleWare,
    AuthController.deleteUser
);

export default userRouter;