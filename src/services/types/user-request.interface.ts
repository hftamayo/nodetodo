export interface UserRequestBody {
    id: string;
    name: string;
    email: string;
    age: number;
    password: string;
}

export type PartialUserRequestBody = Partial<UserRequestBody>;

export interface UserId {
    id: string;
}