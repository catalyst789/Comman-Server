import { Request, Response } from "express";
import todoModel, { ITodo } from "../models/todoModel";
import { CustomeRequest } from "../middleware/isAuthenticated";
import userModel from "../models/userModel";

export const defaultController = (req: Request, res: Response) => {
        return res.sendStatus(200);
}

export const getAllTodo = async(req: Request, res: Response) => {
    try{
        const todos = await todoModel.find().populate('createdBy', ['username', 'profilePic']).sort({createdAt: -1});
        // todos.sort((prev, next) => (next.createdAt.getSeconds() - prev.createdAt.getSeconds()));
        return res.status(200).json({todos});
    }catch(error){
        return res.status(500).json({error});
    }
}

export const getTodo = async(req: Request, res: Response) => {
    try{
        const todoId = req.params.id;
        const todo = await todoModel.findById(todoId);
        return res.status(200).json({todo});
    }catch(error){
        return res.status(500).json({error});
    }
}

export const getMyTodo = async(req: Request, res: Response) => {
    try{
        const { username } = (req as CustomeRequest).token;
        const user = await userModel.findOne({username}).populate('todo');
        const todo = user.todo as ITodo[];
        todo.sort((prev, next) => next.createdAt.getSeconds() - prev.createdAt.getSeconds());
        return res.status(200).json({todo});
    }catch(error){
        return res.status(500).json({error});
    }
}

export const createTodo = async(req: Request, res: Response) => {
    try{
        const { username } = (req as CustomeRequest).token;
        const user = await userModel.findOne({username});
        if(!user) return res.status(403).json({message: 'User Not Exits...!'});
        const { title, description } = req.body;
        const newTodo = new todoModel({title, description, isDone: false, createdBy: user.id});
        const savedTodo = await newTodo.save();
        user.todo.push(savedTodo.id);
        await user.save();
        return res.status(201).json({savedTodo});
    }catch(error){
        return res.status(500).json({error});
    }
}

export const updateTodo = async(req: Request, res: Response) => {
    try{
        const todoId = req.params.id;
        const { username } = (req as CustomeRequest).token;
        const user = await userModel.findOne({username});
        if(!user) return res.status(403).json({message: 'User not exit..!'});
        const { title, description, isDone } = req.body;
        const todo = await todoModel.findById(todoId).populate('createdBy');
        if((todo.createdBy as any).id !== user.id) return res.status(406).json({message: 'Data not Belongs'});  
        todo.title = title;
        todo.description = description;
        todo.isDone = isDone;
        const updatedTodo = await todo.save();
        return res.status(200).json({updatedTodo});
    }catch(error){
        return res.status(500).json({error});
    }
}

export const deleteTodo = async(req: Request, res: Response) => {
    try{
        const todoId = req.params.id;
        await todoModel.findByIdAndDelete(todoId);
        return res.status(200).json({message: 'deleted'});
    }catch(error){
        return res.status(500).json({error});
    }
}