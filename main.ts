import http from "http";
import UrlPattern from "url-pattern";

import { sequelizeInstance } from "./data-sources";

import { AppController } from "./controllers/app";
import { AuthController } from "./controllers/auth";
import { UsersController } from "./controllers/users";
import { ArticlesController } from "./controllers/articles";
import { Request, RequestHandler, getAuthorization, getQuery } from "./controllers/controllers";

const appController = new AppController();
const authController = new AuthController();
const usersController = new UsersController();
const articlesController = new ArticlesController();

const ROUTES: { pattern: UrlPattern, handler: RequestHandler }[] = [
    {
        pattern: new UrlPattern("/login"),
        handler: authController.login,
    },
    {
        pattern: new UrlPattern("/register"),
        handler: authController.register,
    },
    {
        pattern: new UrlPattern("/logout"),
        handler: authController.logout,
    },

    {
        pattern: new UrlPattern("/users"),
        handler: usersController.getAll,
    },

    {
        pattern: new UrlPattern("/create"),
        handler: articlesController.create,
    },
    {
        pattern: new UrlPattern("/:articleId/comments"),
        handler: articlesController.createComment,
    },
    {
        pattern: new UrlPattern("/:articleId"),
        handler: articlesController.getById,
    },
    {
        pattern: new UrlPattern(/(\/$)|(\/\?)/),
        handler: articlesController.getAll,
    },

    {
        pattern: new UrlPattern("*"),
        handler: appController.page404,
    },
];

(async () => {
    await sequelizeInstance.sync();
    
    const server = http.createServer();
    
    server.on("request", async (_req, res) => {
        const req = _req as Request;

        const authorization = await getAuthorization(req);

        req["params"] = {};
        req["query"] =  getQuery(_req);
        req["authorization"] = authorization;

        if(req.url){
            for(const route of ROUTES){
                const { pattern, handler } = route;

                const matchers = pattern.match(req.url);

                req.params = {
                    ...req.params,
                    ...matchers,
                }

                if(matchers){
                    await handler(req, res);
                    return;
                }
            }
        }

        res.end(appController.page404(req, res));
    });

    server.listen(8000);

    console.log("Started http server on http://localhost:8000");
})();

