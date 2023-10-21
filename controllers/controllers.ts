import {IncomingMessage, ServerResponse} from "http"

import { User, UserModel } from "../models/user";

export type RequestAuthorization =  {
    isAuthorized: false;
    user?: undefined;
} | {
    isAuthorized: true;
    user: User;
};

export type Request = IncomingMessage & {
    authorization: RequestAuthorization;
    params: Record<string, string>;
    query: Record<string, string>;
}

export type RequestHandler = (req: Request, res: ServerResponse) => void | Promise<void>;

export const getQuery = (req: IncomingMessage): Record<string, string> => {
    return req.url ? Object.fromEntries(req.url.split("?").map((query) => query.split("="))) : {};
}

export const getAuthorization = async (req: IncomingMessage): Promise<RequestAuthorization> => {
    if(!req.headers.cookie){
        return {
            isAuthorized: false,
        }
    }

    const { blogAuth } = Object.fromEntries(req.headers.cookie.split(";").map((cookie) => cookie.split("=")));
    if(!blogAuth){
        return {
            isAuthorized: false,
        }
    }

    const userId = blogAuth.split(":")[1];
    if(!userId){
        return {
            isAuthorized: false,
        }
    }

    const userResult = await UserModel.findByPk(userId, {attributes: ["id", "username", "avatar", "displayName"]});
    if(!userResult){
        return {
            isAuthorized: false,
        }
    }

    return {
        isAuthorized: true,
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

            const formData = Object.fromEntries(body.split("&").map((pair) => pair.replace(/\+/ig, " ").replace(/\%2C/ig, ",").split("=")));

            resolve(formData as T)
        });
})