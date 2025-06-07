import { Router } from "express";
import { ApplicationController } from "../controllers";
import { authMiddleWare } from "../middlewares";

const applicationRouter = Router();

//get requests
applicationRouter.get(
    "/all",
    // @ts-ignore
    authMiddleWare,
    ApplicationController.all
);
applicationRouter.get(
    "/get/:id",
    // @ts-ignore
    authMiddleWare,
    ApplicationController.getById
);
applicationRouter.get(
    "/user/:uid",
    // @ts-ignore
    authMiddleWare,
    ApplicationController.getByUid
);

//post requests
applicationRouter.post(
    "/add",
    // @ts-ignore
    authMiddleWare,
    ApplicationController.add
);

//update requests
applicationRouter.patch(
    "/:id",
    // @ts-ignore
    authMiddleWare,
    ApplicationController.updateById
);

//delete requests
applicationRouter.delete(
    "/:id",
    // @ts-ignore
    authMiddleWare,
    ApplicationController.deleteById
);

export default applicationRouter;