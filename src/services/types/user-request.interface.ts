export interface UserRequestBody {
    name: string;
    email: string;
    age: number;
    password: string;
}

export interface IdPasswordBody {
    id: string;
    password: string;
}