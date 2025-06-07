import mongoose, { Schema, Document } from "mongoose";

export interface IKey extends Document {
    uid: string,
    apikey: string,
    connected: boolean,
    createdAt: Date,
    updatedAt: Date
}

const KeySchema: Schema = new Schema({
    uid: {
        type: String,
        trim: true,
        required: [true, "User ID must be provided"]
    },
    apikey: {
        type: String,
        trim: true,
        required: [true, "OpenAI API Key must be provided"]
    },
    connected: {
        type: Boolean,
        trim: true,
        default: false,
        required: true
    }
}, {
    timestamps: true,
})

const Key = mongoose.model<IKey>("Key", KeySchema);
export default Key;