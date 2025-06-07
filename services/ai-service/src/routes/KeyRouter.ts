import { Router } from "express";
import { authMiddleWare } from "../middlewares";
import { KeyController } from "../controllers";

const keyRouter = Router();

//get requests
keyRouter.get("/all",
    // @ts-ignore
    authMiddleWare,
    KeyController.getAll
)
keyRouter.get(
    "/user/:uid",
    // @ts-ignore
    authMiddleWare,
    KeyController.getByUid
);

//post requests
keyRouter.post(
    "/add",
    // @ts-ignore
    authMiddleWare,
    KeyController.create
);

//update requests
keyRouter.patch(
    "/:id",
    // @ts-ignore
    authMiddleWare,
    KeyController.updateById
);

//delete requests
keyRouter.delete(
    "/:id",
    // @ts-ignore
    authMiddleWare,
    KeyController.deleteById
);


export default keyRouter;