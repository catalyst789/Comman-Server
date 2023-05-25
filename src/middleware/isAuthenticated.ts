import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import { CutomeJWTPayload } from "../interfaces/jwt_payload";

export interface CustomeRequest extends Request {
    token: CutomeJWTPayload
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try{
        // const token = req.headers.authorization;
        const token = req.cookies['auth-cookie'];
        if(!token) return res.sendStatus(401);
        const verify = jwt.verify(token, config.jwtSecret);
        if(!verify) return res.sendStatus(401);
        console.log(verify);
        (req as CustomeRequest).token = verify as CutomeJWTPayload;
        next();
    }catch(error){
        res.clearCookie('auth-cookie');
        res.sendStatus(401);
    }
}