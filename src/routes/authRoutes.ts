import express from "express";
import { defaultController, getAllUsers, logOut, profilePic, signIn, signUp } from "../controllers/authControllers";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express();

router.get('/', isAuthenticated, defaultController);

router.get('/getAllUsers', isAuthenticated, getAllUsers);

router.post('/signup', signUp);

router.post('/signin', signIn);

router.post('/profilePic', isAuthenticated, profilePic);

router.get('/logout', isAuthenticated, logOut);

export default router;