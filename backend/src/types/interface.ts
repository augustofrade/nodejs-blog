export interface UserProfile {
    username: string;
    email?: string;
    emailConfirmed?: boolean;
    name?: {
        firstName: string,
        lastName: string
    };
    birth?: Date;
    picture?: string;
    country?: string;
    description?: string;
    following?: UserProfile[];
    followers?: UserProfile[];
    socialMedia?: {
        name: string;
        url: string;
    }[];
}

export interface User {
    id: string;
    username: string;
    email: string;
}