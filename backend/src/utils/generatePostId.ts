import { nanoid } from "nanoid";

const generatePostId = (length: number = 7): string => {
    return nanoid(length);
}

export default generatePostId;