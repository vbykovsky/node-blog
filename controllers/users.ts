import { RequestHandler } from "../app/requests";

import { UserModel } from "../models/user";

import { UsersView } from "../views/users";

class UsersController {
    private view = new UsersView();

    getAll: RequestHandler = async (req, res) => {
        const usersResults = await UserModel.findAll();

        const users = usersResults.map((user) => user.dataValues);

        res.end(this.view.users(req.authentication, users));
    }
}

export const usersController = new UsersController();
