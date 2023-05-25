import express from "express";
import { createTodo, defaultController, deleteTodo, getAllTodo, getMyTodo, getTodo, updateTodo } from "../controllers/crudController";

const router = express();

router.get('/', defaultController);

router.get('/todos', getAllTodo);

router.get('/myTodo', getMyTodo);

router.get('/todo/:id', getTodo);

router.post('/todo', createTodo);

router.patch('/todo/:id', updateTodo);

router.delete('/todo/:id', deleteTodo);


export default router;