import { Request, Response } from "express";
import fs from "fs";
import fileModel from "../models/fileModel";

export const defaultController = (req: Request, res: Response) => {
  try {
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getFile = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;
    console.log(fileId);
    const file = await fileModel.findById(fileId);
    if(!file) return res.status(404).json(null);
    res.type(file.mimeType);
    res.send(file.content);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

export const getFileWithMetaData = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;
    const file = await fileModel.findById(fileId);
    if(!file) return res.status(404).json(null);
    return res.status(200).json(file);
  } catch (error) {
    return res.status(500).send(error);
  }
};
