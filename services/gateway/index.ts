import express from "express";
import proxy from "express-http-proxy";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = proxy("http://localhost:5001");
const applications = proxy("http://localhost:5002");
const keys = proxy("http://localhost:5003");

app.use("/api/users", users);
app.use("/api/applications", applications);
app.use("/api/keys", keys);

const server = app.listen(5000, () => {
    console.log("Gateway is Listening to Port 5000 ✅");
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.log("Server closed");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: unknown) => {
    console.log(error);
    exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
