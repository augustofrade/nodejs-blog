import { nanoid } from "nanoid";

const generateCommentId = (): string => {
    return nanoid(12);
}

export default generateCommentId;