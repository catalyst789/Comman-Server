import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { defaultController, getFile, getFileWithMetaData } from "../controllers/fileController";

const router = express();

router.get('/', defaultController);

router.get('/:id', getFile);

router.get('/fileWithMetaData/:id', getFileWithMetaData);

export default router;