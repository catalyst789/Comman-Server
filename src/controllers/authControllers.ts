import { Request, Response } from "express";
import userModel from "../models/userModel";
import { scryptSync, randomBytes, randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { CutomeJWTPayload } from "../interfaces/jwt_payload";
import { CustomeRequest } from "../middleware/isAuthenticated";
import { UploadedFile } from "express-fileupload";
import fileModel from "../models/fileModel";

export const defaultController = (req: Request, res: Response) => {
    try{
        return res.sendStatus(200);
    }catch(error){
        return res.status(500).json({error});
    }
}

export const getAllUsers = async(req: Request, res: Response) => {
    try{
        const users = await userModel.find().populate('todo');
        return res.status(200).json({users});
    }catch(error){
        return res.status(500).json({error});
    }
}

export const signUp = async(req: Request, res: Response) => {
    try{
        const { username, password } = req.body;
        const user = await userModel.findOne({username});
        if(user) return res.status(409).json({message: 'user already exists'});
        const salt = randomBytes(16).toString("hex");
        const hash = scryptSync(password, salt, 64).toString("hex");
        const hashedPassword = `${hash}.${salt}`;
        const newUser = new userModel({username, password: hashedPassword});
        const savedUser = await newUser.save();
        const token = jwt.sign({username}, config.jwtSecret, {expiresIn: 3600});
        // res.cookie('auth-cookie', token);
        res.cookie('auth-cookie', token, {sameSite: "none", secure: true});
        return res.status(201).json({savedUser, token});
    }catch(error){
        return res.status(500).json({error});
    }
}

export const signIn = async(req: Request, res: Response) => {
    try{
        console.log(req.body);
        if(!req.body.username || !req.body.password) return res.status(400).json({error: 'no body found'});
        const { username, password } = req.body;
        const user = await userModel.findOne({username});
        if(!user) return res.status(404).json({message: 'user not found'});
        const salt = user.password.split('.')[1].toString();
        const hash = scryptSync(password, salt, 64).toString("hex");
        const hashedPassword = `${hash}.${salt}`;
        if(hashedPassword !== user.password) return res.status(404).json({message: 'Wrong Credentials'});
        const token = jwt.sign({username}, config.jwtSecret, {expiresIn: 7200});
        // res.cookie('auth-cookie', token);
        res.cookie('auth-cookie', token, {sameSite: "none", secure: true});
        return res.status(200).json({token});
    }catch(error){
        console.log(error);
        return res.status(500).json({error});
    }
}
export const profilePic = async(req: Request, res: Response) => {
    try{
        const userInfo: CutomeJWTPayload = (req as CustomeRequest).token;
        const user = await userModel.findOne({username: userInfo.username});
        if(!user) return res.status(404).json("User not found");
        console.log(req.files);
        const file:UploadedFile = req.files.profilePic as UploadedFile;
        const { name, mimetype, size, data } = file;
        const newFile = new fileModel({name, size, mimeType: mimetype, id: randomUUID(), content: data});
        const savedFile = await newFile.save();
        user.profilePic = savedFile._id.toString();
        const savedUser = await user.save();
        return res.status(200).json({savedUser});
    }catch(error){
        console.log(error);
        return res.status(500).json(error);
    }
}


export const logOut = async(req: Request, res: Response) => {
    try{
        res.clearCookie('auth-cookie', {sameSite: "none", secure: true});
        return res.status(200).json({message: 'logout'});
    }catch(error){
        console.log(error);
        return res.status(500).json({error});
    }
}

