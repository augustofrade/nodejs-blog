export interface User {
    id: string;
    username: string;
    email: string;
}

export interface SocialMedia {
    name: string;
    url: string;
}

export interface RefreshToken {
    idUser: string;
    username: string;
}

export interface HTTPErrorResponse {
    error: true;
    msg: string;
}

export interface HTTPDefaultResponse {
    msg?: string;
    data: unknown;
}