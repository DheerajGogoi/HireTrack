import { Request, Response } from 'express';
import config from "../config/config";
import { ApiError } from "../utils";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

const getCoverLetter = async (req: Request, res: Response): Promise<any> => {
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 10;
        if (progress > 90) progress = 90;
        process.stdout.write(`\rProcessing: ${progress}%...`);
    }, 500);
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Generate a cover letter for the role: SDE-1 at xyz company." }],
            store: true
        });
        clearInterval(progressInterval);
        console.log("\rProcessing: 100% ✅");
        console.log("Cover Letter:\n", response.choices[0].message.content);
    } catch (error: any) {
        clearInterval(progressInterval);
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message,
                ...(config.NODE_ENV !== 'production' && { stack: error.stack }),
            });
        }

        return res.status(500).json({
            status: 500,
            message: error.message,
            ...(config.NODE_ENV !== 'production' && { stack: error.stack }),
        });
    }
}

export default { getCoverLetter };