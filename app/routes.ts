import UrlPattern from "url-pattern";

import { appController } from "../controllers/app";
import { authController } from "../controllers/auth";
import { usersController } from "../controllers/users";
import { articlesController } from "../controllers/articles";

import { RequestHandler } from "./requests";

export type Route = {
    urlPattern: UrlPattern;
    handler: RequestHandler;
}

export const routes: Route[] = [
    // auth
    {
        urlPattern: new UrlPattern("/login"),
        handler: authController.login,
    },
    {
        urlPattern: new UrlPattern("/register"),
        handler: authController.register,
    },
    {
        urlPattern: new UrlPattern("/logout"),
        handler: authController.logout,
    },

    // users
    {
        urlPattern: new UrlPattern("/users"),
        handler: usersController.getAll,
    },

    // articles + comments
    {
        urlPattern: new UrlPattern("/create"),
        handler: articlesController.create,
    },
    {
        urlPattern: new UrlPattern("/:articleId/comments"),
        handler: articlesController.createComment,
    },
    {
        urlPattern: new UrlPattern("/:articleId"),
        handler: articlesController.getById,
    },
    {
        urlPattern: new UrlPattern(/(\/$)|(\/\?)/),
        handler: articlesController.getAll,
    },

    // other
    {
        urlPattern: new UrlPattern("*"),
        handler: appController.page404,
    },
];