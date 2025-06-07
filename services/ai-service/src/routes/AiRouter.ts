import { Router } from "express";
import { authMiddleWare } from "../middlewares";
import AiController from "../controllers/AiController";

const aiRouter = Router();

aiRouter.post(
    "/generate",
    // @ts-ignore
    authMiddleWare,
    AiController.getCoverLetter
)

export default aiRouter;