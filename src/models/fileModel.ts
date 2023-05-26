import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
    name: string,
    id: string,
    mimeType: string,
    size: number,
    content: Buffer,
    owner: string[],
    /* below will be generated from mongoose on creating one */
    createdAt: NativeDate,
    updatedAt: NativeDate
}

const fileSchema = new mongoose.Schema({
    name: String,
    id: String,
    mimeType: String,
    size: Number,
    content: Buffer,
    owner: {type: mongoose.Types.ObjectId, ref: "user"}
}, {timestamps: true});

export default mongoose.model('file', fileSchema);

