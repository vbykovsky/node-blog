import { RequestHandler, getFormData } from "../app/requests";

import { UserCreate, UserModel } from "../models/user";

import { AuthView } from "../views/auth";

type LoginData = {
    username: string;
    password: string;
}

class AuthController {
    private view = new AuthView();

    login: RequestHandler = async (req, res)=> {
        if(req.method === "POST"){
            const data = await getFormData<LoginData>(req);

            if(!data.username || !data.password){
                res.statusCode = 400;
                res.end(this.view.renderError(400));
                return;
            }

            const user = await UserModel.findOne({ where: { username:data.username, password: data.password } });

            if(!user){
                res.statusCode = 400;
                res.end(this.view.renderError(400));
                return;
            }

            res.writeHead(302, {
                "set-cookie": `blogAuth=user:${user.dataValues.id}`,
                Location: "/",
            });
            res.end();

            return;
        }

        res.end(this.view.login());
        return ;
    }

    register: RequestHandler = async (req, res)=> {
        if(req.method === "POST"){
            const data = await getFormData<UserCreate>(req);

            if(!data.username || !data.password){
                res.statusCode = 400;
                res.end(this.view.renderError(400));
                return;
            }

            const user = await UserModel.create(data);

            if(!user){
                res.statusCode = 400;
                res.end(this.view.renderError(400));
                return;
            }

            res.writeHead(302, {
                "set-cookie": `blogAuth=user:${user.dataValues.id}`,
                Location: "/",
            });
            res.end();

            return;
        }

        res.end(this.view.registration());
        return ;
    }

    logout: RequestHandler = async (req, res) => {
        res.writeHead(302, {
            "set-cookie": `blogAuth=`,
            Location: "/",
        });
        res.end();
    }
}

export const authController = new AuthController();
