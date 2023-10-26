import { RequestHandler, getFormData } from "../app/requests";
import { BadRequestError, RequestError } from "../app/errors";

import { AuthService } from "../services/auth";

import { AuthView } from "../views/auth";

import { UserCreate } from "../models/user";

type LoginData = {
    username: string;
    password: string;
}

class AuthController {
    private view = new AuthView();
    private service = new AuthService();

    login: RequestHandler = async (req, res) => {
        if(req.method !== "POST"){
            res.end(this.view.login());
            return;
        }

        try {
            const data = await getFormData<LoginData>(req);

            if(!data.username || !data.password){
                throw new BadRequestError("Invalid request data");
            }

            const { sessionCookie } = await this.service.login(data.username, data.password);

            res
                .writeHead(302, {
                    "set-cookie": sessionCookie,
                    Location: "/",
                })
                .end();
        }
        catch(error){
            if(error instanceof RequestError){
                res.statusCode = error.status;
                res.end(this.view.renderError(req.authentication, error.status, error.message));
                return;
            }

            if (error instanceof Error){
                res.statusCode = 500;
                res.end(this.view.renderError(req.authentication, 500, error.message));
            }
        }
    }

    register: RequestHandler = async (req, res) => {
        if(req.method !== "POST"){
            res.end(this.view.registration());
            return;
        }

        try {
            const data = await getFormData<UserCreate>(req);

            if(!data.username || !data.password){
                throw new BadRequestError("Invalid request data");
            }

            const { sessionCookie } = await this.service.register(data);

            res
                .writeHead(302, {
                    "set-cookie": sessionCookie,
                    Location: "/",
                })
                .end();
        }
        catch(error){
            if(error instanceof RequestError){
                res.statusCode = error.status;
                res.end(this.view.renderError(req.authentication, error.status, error.message));
                return;
            }

            if (error instanceof Error){
                res.statusCode = 500;
                res.end(this.view.renderError(req.authentication, 500, error.message));
            }
        }
    }

    logout: RequestHandler = async (req, res) => {
        res
            .writeHead(302, {
                "set-cookie": `blogAuth=`,
                Location: "/",
            })
            .end();
    }
}

export const authController = new AuthController();
