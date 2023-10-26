import { BadRequestError } from "../app/errors";

import { UsersDataSource } from "../data-sources/user";

import { UserCreate } from "../models/user";

export class AuthService {
    private dataSource = new UsersDataSource();

    register = async (registerUser: UserCreate) => {
        const checkExistUser = await this.dataSource.findByUsername(registerUser.username);

        if(checkExistUser){
            throw new BadRequestError("User with provided username already exists");
        }

        const userResult = await this.dataSource.create(registerUser);

        const user = userResult.dataValues;

        return {
            user,
            sessionCookie: `blogAuth=user:${user.id}`
        };
    }

    login = async (username: string, password: string) => {
        const userResult = await this.dataSource.findByUsername(username);

        if(!userResult){
            throw new BadRequestError("User with provided username/password was not found");
        }

        if(userResult.dataValues.password !== password){
            throw new BadRequestError("User with provided username/password was not found");
        }

        const user = userResult.dataValues;

        return {
            user,
            sessionCookie: `blogAuth=user:${user.id}`
        };
    }
}