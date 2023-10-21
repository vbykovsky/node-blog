import { DataTypes, Model } from "sequelize";

import { sequelizeInstance } from "../data-sources";

export interface User {
    id: number;

    username: string;
    password: string;

    avatar: string;
    displayName: string;
}

export type UserCreate = Omit<User, "id">;
export type UserAttributes = Omit<User, "id">

export const UserModel = sequelizeInstance.define<Model<User,UserCreate>, UserAttributes>("user", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    
    avatar: DataTypes.STRING,
    displayName: DataTypes.STRING,
}, {
    tableName: "users",
})