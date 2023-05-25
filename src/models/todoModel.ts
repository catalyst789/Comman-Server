import mongoose, { Document } from "mongoose";
import { REACTIONS } from "../enums/reactions";
import { POST_CONTENT_TYPE } from "../enums/postContentType";


const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    isDone: Boolean,
    content: [
        {
            type: {type: String, enum: POST_CONTENT_TYPE},
            url: String
        }
    ],
    reactions: [
        {
            reactedBy: {type: mongoose.Types.ObjectId, ref: 'user'},
            reaction: {type: String, enum: REACTIONS}
        }
    ],
    createdBy: {type: mongoose.Types.ObjectId, ref: 'user'},
}, {timestamps: true});

const userModel = mongoose.model('todo', todoSchema);

export interface ITodo extends Document {
    title: string,
    description: string,
    isDone: boolean,
    createdBy: string,
    reactions: [],
    /* below will be generated from mongoose on creating one */
    createdAt: NativeDate,
    updatedAt: NativeDate
}


export default userModel;