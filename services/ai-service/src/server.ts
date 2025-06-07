import express, { Express, Request, Response } from 'express';
import { Server } from 'http';
import { connectDB } from "./database";
import { keyRouter, aiRouter } from './routes';
import config from './config/config';
import { errorConverter, errorHandler } from './middlewares';

const app: Express = express();
let server: Server;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(keyRouter);
app.use(aiRouter);

app.use(errorConverter);
app.use(errorHandler);

connectDB();

server = app.listen(config.PORT, () => {
    console.log(`Server is running on port: ${config.PORT}`)
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