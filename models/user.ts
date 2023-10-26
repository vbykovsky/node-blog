import { Model } from "sequelize";

export interface User {
    id: number;

    username: string;
    password: string;

    avatar: string;
    displayName: string;
}

export type UserCreate = Omit<User, "id">;
export type UserAttributes = Omit<User, "id">;

export type UserModel = Model<User, UserCreate>;