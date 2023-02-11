import { GenericToken } from './../types/interface';
import crypto from "crypto";

export const generateGenericToken = (days: number = 1): GenericToken => {
    const today = new Date();
    const expirationDate = new Date(today.getDate() + days);
    return {
        hash: crypto.randomBytes(32).toString("hex"),
        expiration: expirationDate
    }
}