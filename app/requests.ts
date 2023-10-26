import { IncomingMessage, ServerResponse } from "http";

import { UsersDataSource } from "../data-sources/user";

import { User } from "../models/user";
import { AuthService } from "../services/auth";

export type RequestAuthenticated = {
    isAuthenticated: true;
    user: User;
};

export type RequestNotAuthenticated = {
    isAuthenticated: false;
    user?: undefined;
};

export type RequestAuthentication = RequestNotAuthenticated | RequestAuthenticated;

export type Request = IncomingMessage & {
    authentication: RequestAuthentication;
    params: Record<string, string>;
    query: Record<string, string>;
}

export type AuthenticatedRequest = Omit<Request, "authentication"> & {
    authentication: RequestAuthenticated;
}

export type RequestHandler = (req: Request, res: ServerResponse) => void | Promise<void>;

export type RequestAuthenticatedHandler = (req: AuthenticatedRequest, res: ServerResponse) => void | Promise<void>;

export const parseQuery = (req: IncomingMessage): Record<string, string> => {
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

    try{
        const tokenUser = new AuthService().getAuthTokenData(blogAuth);
    
        return {
            isAuthenticated: true,
            user: tokenUser,
        }
    }
    catch(error){
        return {
            isAuthenticated: false,
        }
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