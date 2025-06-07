import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

export interface IUser extends Document {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date
}

const UserSchema: Schema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, "First name must be provided"]
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, "Last name must be provided"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    password: {
        type: String,
        trim: false,
        required: [true, "Password must be provided"]
    },
}, {
    timestamps: true,
})

const User = mongoose.model<IUser>("User", UserSchema);
export default User;