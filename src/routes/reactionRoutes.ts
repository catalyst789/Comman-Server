import express from "express";
import { defaultController, getReactions, getReactionsByType, hitReaction, removeReaction } from "../controllers/reactionController";

const router = express();

router.get('/', defaultController);

router.get('/:id', getReactions);

router.get('/:id/:reactionType', getReactionsByType);

router.post('/:id', hitReaction);

router.delete('/:id', removeReaction);


export default router;