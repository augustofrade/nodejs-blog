import { nanoid } from "nanoid";

const generatePostId = (): string => {
    return nanoid(7);
}

export default generatePostId;