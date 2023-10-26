import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../app/errors";

import { UsersDataSource } from "../data-sources/user";

import { User } from "../models/user";

import { LoginDTO } from "../dtos/LoginDTO";
import { RegisterDTO } from "../dtos/RegisterDTO";

export class AuthService {
    private static JWT_SECRET = "vbykovsky_blog";
    private static JWT_EXPIRES_SECONDS = 60 * 60 * 24; // 24 hours

    private dataSource = new UsersDataSource();

    private getHashed = (value: string) => {
        return bcrypt.hashSync(value, bcrypt.genSaltSync());
    }

    private compareWithHashed = (value: string, hashedValue: string) => {
        return bcrypt.compareSync(value, hashedValue);
    }

    private generateAuthToken = (user: User) => {
        return jwt.sign(user, AuthService.JWT_SECRET, { expiresIn: AuthService.JWT_EXPIRES_SECONDS });
    }

    private getAuthCookie = (user: User) => {
        return `blogAuth=${this.generateAuthToken(user)}`;
    }

    getAuthTokenData = (token: string) => {
        return jwt.verify(token, AuthService.JWT_SECRET) as User;
    }

    register = async (registerDto: RegisterDTO) => {
        const checkExistUser = await this.dataSource.findByUsername(registerDto.username);

        if(checkExistUser){
            throw new BadRequestError("User with provided username already exists");
        }

        const userResult = await this.dataSource.create({ ...registerDto, password: this.getHashed(registerDto.password) });

        const user = userResult.dataValues;

        return {
            user,
            sessionCookie: this.getAuthCookie(user),
        };
    }

    login = async (loginDto: LoginDTO) => {
        const userResult = await this.dataSource.findByUsername(loginDto.username);

        if(!userResult){
            throw new BadRequestError("User with provided username/password was not found");
        }

        if(!this.compareWithHashed(loginDto.password, userResult.dataValues.password)){
            throw new BadRequestError("User with provided username/password was not found");
        }

        const user = userResult.dataValues;
        

        return {
            user,
            sessionCookie: this.getAuthCookie(user),
        };
    }
}