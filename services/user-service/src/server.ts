import express, { Express, Request, Response } from 'express';
import { Server } from "http";
import { userRouter } from './routes';
import { errorConverter, errorHandler } from './middlewares';
import { connectDB } from './database';
import config from './config/config';

const app: Express = express();
let server: Server;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRouter);

app.use(errorConverter);
app.use(errorHandler);

connectDB();

server = app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});

app.get("/", async (req: Request, res: Response): Promise<any> => {
    return res.status(200).json("working!");
})

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.info("Server closed");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: unknown) => {
    console.error(error);
    exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);