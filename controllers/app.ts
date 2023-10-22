import { AppView } from "../views/app";

import { RequestHandler } from "../app/requests";

class AppController {
    private view = new AppView();

    page404: RequestHandler = async (req, res) => {
        res.statusCode = 404;
        res.end(this.view.renderError(404));
    }
}

export const appController = new AppController();
