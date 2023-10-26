import { Attributes, DataTypes, FindOptions } from "sequelize";

import { sequelizeInstance } from "./sources/source";

import { UserAttributes, UserCreate, UserModel } from "../models/user";

interface UsersRepository {
    create(data: UserCreate): Promise<UserModel>;

    findAll(): Promise<UserModel[]>;
    findById(id: number, options?: Omit<FindOptions<Attributes<UserModel>>, 'where'>): Promise<UserModel | null>;
    findByUsername(username: string): Promise<UserModel | null>;
}

export class UsersDataSource implements UsersRepository {
    private model = sequelizeInstance.define<UserModel, UserAttributes>("user", {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        
        avatar: DataTypes.STRING,
        displayName: DataTypes.STRING,
    }, {
        tableName: "users",
    });

    create(data: UserCreate): Promise<UserModel> {
        return this.model.create(data);
    }

    findAll(): Promise<UserModel[]> {
        return this.model.findAll();
    }

    findById(id: number, options?: Omit<FindOptions<Attributes<UserModel>>, 'where'>): Promise<UserModel | null> {
        return this.model.findByPk(id, options);
    }

    findByUsername(username: string): Promise<UserModel | null> {
        return this.model.findOne({ where: { username } });
    }
}