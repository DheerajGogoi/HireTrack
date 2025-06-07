import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
    uid: string,
    url: string,
    cover_letter: string,
    title: string,
    description: string,
    applied: boolean,
    company: string,
    referral: string,
    createdAt: Date,
    updatedAt: Date
}

const ApplicationSchema: Schema = new Schema({
    uid: {
        type: String,
        trim: true,
        required: [true, "User ID must be provided"]
    },
    url: {
        type: String,
        trim: true,
        required: [true, "Link to Job application must be provided"]
    },
    cover_letter: {
        type: String,
        trim: true,
        required: false
    },
    title: {
        type: String,
        required: [true, "Please provide a valid title"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    applied: {
        type: Boolean,
        default: false,
        required: true
    },
    company: {
        type: String,
        required: [true, "Please provide a valid company name"]
    },
    referral: {
        type: Boolean,
        default: false,
        require: true
    },
}, {
    timestamps: true,
})

const Application = mongoose.model<IApplication>("Application", ApplicationSchema);
export default Application;