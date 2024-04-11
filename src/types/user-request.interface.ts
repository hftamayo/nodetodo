export interface UserRequestBody {
    id: string;
    name: string;
    email: string;
    age: number;
    password: string;
    newPassword: string;
}

export interface UserId {
    id: string;
}

export interface UserControllerResult {
    httpStatusCode: number;
    message: string;
    user: UserRequestBody;
}

export type PartialUserRequestBody = Partial<UserRequestBody>;

