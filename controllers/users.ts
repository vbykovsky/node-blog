import { UserModel } from "../models/user";

import { UsersView } from "../views/users";

import { RequestHandler } from "./controllers";

export class UsersController {
    private view = new UsersView();

    getAll: RequestHandler = async (req, res) => {
        const usersResults = await UserModel.findAll();

        const users = usersResults.map((user) => user.dataValues);

        res.end(this.view.getAll(req.authorization, users));
    }
}