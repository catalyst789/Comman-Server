import { JwtPayload } from "jsonwebtoken";

export interface CutomeJWTPayload extends JwtPayload {
    username: string;
}