import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    username: string,
    password: string,
    profilePic: string,
    todo: string[],
    /* below will be generated from mongoose on creating one */
    createdAt: NativeDate,
    updatedAt: NativeDate
}

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    profilePic: String,
    todo: [{type: mongoose.Types.ObjectId, ref: 'todo'}]
}, {timestamps: true});

export default mongoose.model('user', userSchema);