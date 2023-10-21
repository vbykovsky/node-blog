import { AppView } from "../views/app";

import { RequestHandler } from "./controllers";

export class AppController {
    private view = new AppView();

    index: RequestHandler = async (req, res) => {
        res.end(this.view.index());
        return;
    }

    page404: RequestHandler = async (erq, res) => {
        res.statusCode = 404;
        res.end(this.view.renderError(404));
    }
}