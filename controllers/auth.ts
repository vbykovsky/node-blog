import { RequestHandler, getFormData } from "../app/requests";
import { BadRequestError, RequestError } from "../app/errors";

import { AuthService } from "../services/auth";

import { AuthView } from "../views/auth";

import { LoginDTO } from "../dtos/LoginDTO";
import { RegisterDTO } from "../dtos/RegisterDTO";

class AuthController {
    private view = new AuthView();
    private service = new AuthService();

    loginForm: RequestHandler = async (req, res) => {
        res.end(this.view.login());
    }

    login: RequestHandler = async (req, res) => {
        try {
            const loginDto = await getFormData<LoginDTO>(req);

            if(!loginDto.username || !loginDto.password){
                throw new BadRequestError("Invalid request data");
            }

            const { sessionCookie } = await this.service.login(loginDto);

            res
                .writeHead(302, { Location: "/", "set-cookie": sessionCookie })
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

    registerForm: RequestHandler = async (req, res) => {
        res.end(this.view.registration());
    }

    register: RequestHandler = async (req, res) => {
        try {
            const registerDto = await getFormData<RegisterDTO>(req);

            if(!registerDto.username || !registerDto.password){
                throw new BadRequestError("Invalid request data");
            }

            const { sessionCookie } = await this.service.register(registerDto);

            res
                .writeHead(302, { Location: "/", "set-cookie": sessionCookie })
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
            .writeHead(302, { Location: "/", "set-cookie": `blogAuth=` })
            .end();
    }
}

export const authController = new AuthController();
