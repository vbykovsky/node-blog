import { RequestHandler } from "../app/requests";

import { UsersService } from "../services/users";

import { UsersView } from "../views/users";

class UsersController {
    private view = new UsersView();
    private service = new UsersService();

    getAll: RequestHandler = async (req, res) => {
        const users = await this.service.getAll();

        res.end(this.view.users(req.authentication, users));
    }
}

export const usersController = new UsersController();
