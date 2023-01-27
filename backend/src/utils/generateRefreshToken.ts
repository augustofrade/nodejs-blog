import { RefreshToken, User } from './../types/interface';
import jwt from "jsonwebtoken";

const generateRefreshToken = (user: User, duration = "30d"): string => {
    return jwt.sign(<RefreshToken>{ idUser: user.id, username: user.username },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: duration });
};

export default generateRefreshToken;