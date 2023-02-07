import { GenericToken } from './../types/interface';
import crypto from "crypto";

export const generateEmailToken = (): GenericToken => {
    const today = new Date();
    const expirationDate = new Date(today.getTime() + 5 * 60000);
    return {
        hash: crypto.randomBytes(32).toString("hex"),
        expiration: expirationDate
    }
}