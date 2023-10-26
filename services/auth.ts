import { BadRequestError } from "../app/errors";

import { UsersDataSource } from "../data-sources/user";

import { LoginDTO } from "../dtos/LoginDTO";
import { RegisterDTO } from "../dtos/RegisterDTO";

export class AuthService {
    private dataSource = new UsersDataSource();

    register = async (registerDto: RegisterDTO) => {
        const checkExistUser = await this.dataSource.findByUsername(registerDto.username);

        if(checkExistUser){
            throw new BadRequestError("User with provided username already exists");
        }

        const userResult = await this.dataSource.create(registerDto);

        const user = userResult.dataValues;

        return {
            user,
            sessionCookie: `blogAuth=user:${user.id}`
        };
    }

    login = async (loginDto: LoginDTO) => {
        const userResult = await this.dataSource.findByUsername(loginDto.username);

        if(!userResult){
            throw new BadRequestError("User with provided username/password was not found");
        }

        if(userResult.dataValues.password !== loginDto.password){
            throw new BadRequestError("User with provided username/password was not found");
        }

        const user = userResult.dataValues;

        return {
            user,
            sessionCookie: `blogAuth=user:${user.id}`
        };
    }
}