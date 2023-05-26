import { Request, Response } from "express";
import todoModel, { ITodo } from "../models/todoModel";
import { CustomeRequest } from "../middleware/isAuthenticated";
import userModel from "../models/userModel";
import { REACTIONS } from "../enums/reactions";

export const defaultController = (req: Request, res: Response) => {
  return res.sendStatus(200);
};

export const getReactions = async (req: Request, res: Response) => {
    try {   
        const entityId: string = req.params.id;
        const post = await todoModel.findById(entityId).populate("reactions.reactedBy", ["username"]).sort({createdAt: -1});
        if(!post) return res.status(404).json({ message: "Entity Not Found"});
        return res.status(200).json(post.reactions);
    } catch (error) {
        return res.status(500).send(error);   
    }
}

export const getReactionsByType = async (req: Request, res: Response) => {
    try {   
        const entityId: string = req.params.id;
        const reactionTypeRequested: string = req.params.reactionType;
        console.log(reactionTypeRequested);
        const post = await todoModel.findById(entityId).populate("reactions.reactedBy", ["username"]);
        if(!post) return res.status(404).json({ message: "Entity Not Found"});
        const filterBasedOnReactions = post.reactions.filter((reaction) => reaction.reaction === reactionTypeRequested);
        return res.status(200).json(filterBasedOnReactions);
    } catch (error) {
        return res.status(500).send(error);   
    }
}

export const hitReaction = async (req: Request, res: Response) => {
  try {
    const { username } = (req as CustomeRequest).token;
    const reactor = await userModel.findOne({ username });
    if (!reactor) return res.status(403).json({ message: "user not exist..!" });
    const { reaction } = req.body;
    if(!REACTIONS[reaction]) return res.status(403).json({message: 'Not a Valid Reaction..!'});
    const postId = req.params.id;
    const post = await todoModel.findById(postId);
    if (!post) res.status(403).json({ message: "Entity Not Exists...!" });
    const reactorPresence = post.reactions.find((r) => String(r.reactedBy) === String(reactor._id));
    console.log({reactorPresence});
    if(reactorPresence){
        reactorPresence.reaction = reaction;
        const savedPost = await post.save();
        return res.status(200).json({ savedPost });
    }
    post.reactions.push({ reactedBy: reactor.id, reaction: reaction });
    const savedPost = await post.save();
    if (!savedPost)
      return res
        .status(203)
        .json({ message: "Failed at saved updated Post..!" });
    return res.status(200).json({ savedPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const removeReaction = async (req: Request, res: Response) => {
    try {
      const { username } = (req as CustomeRequest).token;
      const reactor = await userModel.findOne({ username });
      if (!reactor) return res.status(403).json({ message: "user not exist..!" });
      const postId = req.params.id;
      const post = await todoModel.findById(postId);
      if (!post) res.status(403).json({ message: "Entity Not Exists...!" });
      const reactorPresenceIndex = post.reactions.findIndex((r) => String(r.reactedBy) === String(reactor._id));
      if(reactorPresenceIndex === -1) return res.status(403).json({ message: "No Reaction Exits till now"});
      console.log({reactorPresenceIndex});
      post.reactions.splice(reactorPresenceIndex, 1);
      const savedPost = await post.save();
      return res.status(200).json({savedPost});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  };