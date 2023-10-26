import { AppView } from "../views/app";

import { RequestHandler } from "../app/requests";

class AppController {
    private view = new AppView();

    page401: RequestHandler = async (req, res) => {
        res.statusCode = 401;
        res.end(this.view.renderError(req.authentication, 401));
    }

    page404: RequestHandler = async (req, res) => {
        res.statusCode = 404;
        res.end(this.view.renderError(req.authentication, 404));
    }
}

export const appController = new AppController();
