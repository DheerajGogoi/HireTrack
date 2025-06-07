import mongoose from "mongoose";
import config from "../config/config";

const connectDB = async () => {
    try {
        console.log("Connecting to database... " + config.MONGO_URI);
        await mongoose.connect(config.MONGO_URI!);
        console.log("Database Connected ✅");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export { connectDB };