console.log("Server Called");

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { config } from "./config";
import crudRouter from "./routes/crudRoutes";
import authRouter from "./routes/authRoutes";
import fileRouter from "./routes/fileRoutes";
import reactionRouter from "./routes/reactionRoutes";
import { isAuthenticated } from "./middleware/isAuthenticated";

const app = express();

/* cors configs */
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:3000", "http://localhost:1212"],
    credentials: true,
}));

/* db configuration */
require("./configuration/database");

app.use(cookieParser());
app.use(fileUpload());
app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.get('/health', (req: Request, res: Response) => {
    res.sendStatus(200);
})

app.use('/auth', authRouter);
app.use('/file', isAuthenticated, fileRouter);
app.use('/reaction', isAuthenticated, reactionRouter);
app.use('/', isAuthenticated, crudRouter);

app.listen(config.port, () => console.log("Server up at port: ", config.port));

