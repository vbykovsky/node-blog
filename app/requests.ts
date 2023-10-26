import { IncomingMessage, ServerResponse } from "http";

import { UsersDataSource } from "../data-sources/user";

import { User } from "../models/user";

export type RequestAuthentication =  {
    isAuthenticated: false;
    user?: undefined;
} | {
    isAuthenticated: true;
    user: User;
};

export type Request = IncomingMessage & {
    authentication: RequestAuthentication;
    params: Record<string, string>;
    query: Record<string, string>;
}

export type RequestHandler = (req: Request, res: ServerResponse) => void | Promise<void>;

export const getQuery = (req: IncomingMessage): Record<string, string> => {
    return req.url ? Object.fromEntries(req.url.split("?").map((query) => query.split("="))) : {};
}

export const getAuthentication = async (req: IncomingMessage): Promise<RequestAuthentication> => {
    if(!req.headers.cookie){
        return {
            isAuthenticated: false,
        }
    }

    const { blogAuth } = Object.fromEntries(req.headers.cookie.split("; ").map((cookie) => cookie.split("=")));
    if(!blogAuth){
        return {
            isAuthenticated: false,
        }
    }

    const userId = blogAuth.split(":")[1];
    if(!userId){
        return {
            isAuthenticated: false,
        }
    }

    const userResult = await new UsersDataSource().findById(userId, {
        attributes: ["id", "username", "avatar", "displayName"],
    });
    if(!userResult){
        return {
            isAuthenticated: false,
        }
    }

    return {
        isAuthenticated: true,
        user: userResult.dataValues,
    }
}

export const getFormData = <T extends object>(req: Request) => new Promise<T>((resolve) => {
    const bodyChunks: any[] = [];

    req
        .on('data', (chunk) => {
            bodyChunks.push(chunk);
        })
        .on('end', async () => {
            const body = Buffer.concat(bodyChunks).toString();

            const formData = Object.fromEntries([...(new URLSearchParams(body)).entries()]);

            resolve(formData as T)
        });
})