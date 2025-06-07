import { config } from "dotenv";

const configFile = "./.env";
config({ path: configFile });

const { MONGO_URI, PORT, JWT_SECRET, NODE_ENV, OPENAI_API_KEY } = process.env;

export default { MONGO_URI, PORT, JWT_SECRET, NODE_ENV, OPENAI_API_KEY };