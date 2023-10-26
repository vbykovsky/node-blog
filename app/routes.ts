import UrlPattern from "url-pattern";

import { appController } from "../controllers/app";
import { authController } from "../controllers/auth";
import { usersController } from "../controllers/users";
import { articlesController } from "../controllers/articles";

import { RequestAuthenticatedHandler, RequestHandler } from "./requests";

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export type Route = {
    urlPattern: UrlPattern;
    methods?: RequestMethod[];
    requireAuth?: boolean;
    handler: RequestHandler | RequestAuthenticatedHandler;
}

export const routes: Route[] = [
    // auth
    {
        urlPattern: new UrlPattern("/login"),
        methods: ["GET"],
        handler: authController.loginForm,
    },
    {
        urlPattern: new UrlPattern("/login"),
        methods: ["POST"],
        handler: authController.login,
    },
    {
        urlPattern: new UrlPattern("/register"),
        methods: ["GET"],
        handler: authController.registerForm,
    },
    {
        urlPattern: new UrlPattern("/register"),
        methods: ["POST"],
        handler: authController.register,
    },
    {
        urlPattern: new UrlPattern("/logout"),
        methods: ["GET"],
        requireAuth: true,
        handler: authController.logout,
    },

    // users
    {
        urlPattern: new UrlPattern("/users"),
        methods: ["GET"],
        handler: usersController.getAll,
    },

    // articles + comments
    {
        urlPattern: new UrlPattern("/create"),
        methods: ["GET"],
        requireAuth: true,
        handler: articlesController.createForm,
    },
    {
        urlPattern: new UrlPattern("/create"),
        methods: ["POST"],
        requireAuth: true,
        handler: articlesController.create,
    },
    {
        urlPattern: new UrlPattern("/:articleId/comments/:commentId/delete"),
        methods: ["POST"],
        requireAuth: true,
        handler: articlesController.deleteComment,
    },
    {
        urlPattern: new UrlPattern("/:articleId/comments"),
        methods: ["POST"],
        requireAuth: true,
        handler: articlesController.createComment,
    },
    {
        urlPattern: new UrlPattern("/:articleId/delete"),
        methods: ["POST"],
        requireAuth: true,
        handler: articlesController.delete,
    },
    {
        urlPattern: new UrlPattern("/:articleId"),
        methods: ["GET"],
        handler: articlesController.getById,
    },
    {
        urlPattern: new UrlPattern(/(\/$)|(\/\?)/),
        methods: ["GET"],
        handler: articlesController.getAll,
    },

    // other
    {
        urlPattern: new UrlPattern("**"),
        methods: ["GET"],
        handler: appController.page404,
    },
];